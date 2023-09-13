<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import TopCard from './components/TopCard.svelte';
	import { getSipAmountWithoutMandate } from '../utils';
	import type { UserProfile } from '$lib/types/IUserProfile';
	import SetupSkeletanLoader from './components/SetupSkeletanLoader.svelte';
	import {
		selectedAutopayMethodImpression,
		proceedToAutoPayCreationAnalytics,
		autopayFailedScreenAnalytics,
		doneClickAfterAutopayRegisteredAnalytics,
		autopayRegisteredImpressionAnalytics
	} from '../analytics/autopay';
	import Mandate from '$components/mandate/Mandate.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { getMandateAmount } from '$components/mandate/utils';
	import BankTile from '../(autopay)/components/BankTile.svelte';
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';

	export let data;
	let selectedAccount: number;
	let mode = '';
	let bankPopupVisible = false;
	let allowedPaymentMethods: Array<string> = [];

	$: profileData = $page?.data?.profile;

	const setupBankDetails = (profileDetail: UserProfile) => {
		const bankList = profileDetail?.bankDetails;

		const selectedAccNo = data.pageParam?.acc;

		(bankList || []).forEach((bank, index: number) => {
			if (bank.accNO?.endsWith(selectedAccNo)) {
				selectedAccount = index;
			}
		});
	};

	const assignDefaultMode = async () => {
		const deviceType = $page.data?.deviceType;
		const os = deviceType?.osName || deviceType?.os;
		if ((os === 'Android' || os === 'iOS') && allowedPaymentMethods?.includes('GOOGLEPAY')) {
			mode = 'GOOGLEPAY';
		} else if ((os === 'Android' || os === 'iOS') && allowedPaymentMethods?.includes('PHONEPE')) {
			mode = 'PHONEPE';
		} else if (allowedPaymentMethods?.includes('UPI')) {
			mode = 'UPI';
		} else if (allowedPaymentMethods?.includes('NET_BANKING')) {
			mode = 'NET_BANKING';
		}
	};

	const setupPaymentMethods = async (mandateResponsePromise, promiseResponse) => {
		const response = await promiseResponse;
		const { mandateAmount } = getSipAmountWithoutMandate(response?.data, data?.pageParam?.amount);
		const mandateResponse = await mandateResponsePromise;
		allowedPaymentMethods = [];
		if (mandateResponse.ok) {
			const methods = mandateResponse.data?.data;

			const upiMethod = methods?.['upi'];
			if (
				upiMethod?.status === 'supported' &&
				mandateAmount >= upiMethod?.min_amount &&
				mandateAmount <= upiMethod?.max_amount
			) {
				allowedPaymentMethods.push('PHONEPE');
				allowedPaymentMethods.push('GOOGLEPAY');
				allowedPaymentMethods.push('UPI');
			}

			const netBankingMethod = methods?.['net_banking'];
			const debitCardMethod = methods?.['debit_card'];
			if (
				netBankingMethod?.status === 'supported' &&
				mandateAmount >= netBankingMethod?.min_amount &&
				mandateAmount <= netBankingMethod?.max_amount
			) {
				allowedPaymentMethods.push('NET_BANKING');
			} else if (
				debitCardMethod?.status === 'supported' &&
				mandateAmount >= debitCardMethod?.min_amount &&
				mandateAmount <= debitCardMethod?.max_amount
			) {
				allowedPaymentMethods.push('NET_BANKING');
			}
		}
		assignDefaultMode();
	};

	$: setupBankDetails(profileData);

	const intiateAutoPayProcess = async (mode: string) => {
		const response = await data.api.data;
		const { mandateAmount, totalAmount } = getSipAmountWithoutMandate(
			response?.data,
			data?.pageParam?.amount
		);
		const eventMetaData = {
			ModeofAutopay: mode,
			CurrentSIP: totalAmount,
			Autopaylimit: getMandateAmount(mode, mandateAmount)
		};
		proceedToAutoPayCreationAnalytics(eventMetaData);
	};

	const onAutopaySetupFail = () => {
		autopayFailedScreenAnalytics();
	};

	onMount(async () => {
		const response = await data.api.data;
		const { totalAmount, mandateAmount } = getSipAmountWithoutMandate(
			response?.data,
			data?.pageParam?.amount
		);
		const eventMetaData = {
			ModeofAutopay: mode,
			CurrentSIP: totalAmount,
			Autopaylimit: getMandateAmount(mode, mandateAmount)
		};
		selectedAutopayMethodImpression(eventMetaData);
	});

	const orderPurchaseBulkPatchFunc = async (emandateId: string) => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/bulk`;
			await useFetch(url, {
				method: 'PATCH',
				body: JSON.stringify({
					emandateId
				})
			});
		} catch (e) {
			return;
		}
	};

	const onSuccessCallback = ({ id }) => {
		const eventMetaData = { Autopaylimit: '100000' };
		autopayRegisteredImpressionAnalytics(eventMetaData);
		if (id) {
			orderPurchaseBulkPatchFunc(id);
		}
	};

	const onSuccessPopupClick = async () => {
		doneClickAfterAutopayRegisteredAnalytics();
		await goto(`${base}/discoverfunds`, { replaceState: true });
	};

	const updateMode = (val: string) => {
		mode = val;
	};

	const showBankSelectionPopup = () => {
		if (profileData?.bankDetails?.length <= 1) {
			return;
		}
		bankPopupVisible = true;
	};

	const hideBankSelectionPopup = () => {
		bankPopupVisible = false;
	};

	const onAccountChange = async (index: number) => {
		selectedAccount = index;
		const params = encodeObject({
			...data?.pageParam,
			acc: profileData?.bankDetails?.[selectedAccount]?.accNO
		});
		await goto(`${base}/autopay/manage/setup?params=${params}`, {
			replaceState: true
		});
	};
</script>

{#await data.api.data}
	<SetupSkeletanLoader />
{:then response}
	{#await setupPaymentMethods(data.apis.mandateOptions, data.api.data)}
		<SetupSkeletanLoader />
	{:then}
		{#if selectedAccount >= 0}
			{#if allowedPaymentMethods?.length >= 1}
				{@const { totalAmount, mandateAmount } = getSipAmountWithoutMandate(
					response?.data,
					data?.pageParam?.amount
				)}
				<TopCard {totalAmount} mandateLimit={getMandateAmount(mode, mandateAmount)} />
				<div class="mb-2" />
				<Mandate
					onStart={intiateAutoPayProcess}
					amount={String(mandateAmount)}
					onErrorCallback={onAutopaySetupFail}
					{onSuccessCallback}
					onPendingCallback={onAutopaySetupFail}
					profileData={$page?.data?.profile}
					defaultBankAccount={selectedAccount}
					{onSuccessPopupClick}
					{mode}
					{updateMode}
					{allowedPaymentMethods}
					onAccChange={onAccountChange}
				/>
			{:else}
				{@const bankAccountsLength = profileData?.bankDetails?.length}
				{#if bankAccountsLength > 1}
					<div class="rounded-lg bg-white p-4 shadow-csm">
						<div class="mb-4 text-sm text-grey-body">
							Your current bank account does not support AutoPay. Please choose another bank
							account. If none of your bank accounts support AutoPay, you can still proceed with
							your SIPs by making a one-time payment on the SIP due date.
						</div>
						<BankTile
							bankLogo={profileData?.bankDetails?.[selectedAccount]?.bankLogo}
							bankName={profileData?.bankDetails?.[selectedAccount]?.bankName}
							selectedBankAccount={profileData?.bankDetails?.[selectedAccount]?.accNO}
							bankAccounts={bankAccountsLength}
							{showBankSelectionPopup}
						/>
					</div>
				{:else}
					<div class="rounded-lg bg-white p-4 shadow-csm">
						<div class="text-sm text-black-title">
							Your bank account does not support AutoPay. You can still continue with your SIPs by
							making a one-time payment on your SIP due date.
						</div>
					</div>
				{/if}

				{#if bankPopupVisible}
					<BankSelectionPopup
						bankAccounts={profileData?.bankDetails}
						{selectedAccount}
						{onAccountChange}
						onClose={hideBankSelectionPopup}
					/>
				{/if}
			{/if}
		{:else}
			<div class="rounded-lg bg-white p-4 shadow-csm">
				<div class="text-sm text-black-title">
					A technical error occurred while setting up an AutoPay. Please try again later.
				</div>
			</div>
		{/if}
	{/await}
{/await}
