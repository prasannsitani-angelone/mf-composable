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
			const upiMethod = methods?.['upi'];
			if (
				upiMethod?.status === 'supported' &&
				mandateAmount >= upiMethod?.min_amount &&
				mandateAmount <= upiMethod?.max_amount
			) {
				allowedPaymentMethods.push('UPI');
				allowedPaymentMethods.push('PHONEPE');
				allowedPaymentMethods.push('GOOGLEPAY');
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

	const onSuccessCallback = () => {
		const eventMetaData = { Autopaylimit: '100000' };
		autopayRegisteredImpressionAnalytics(eventMetaData);
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
		encodeObject({
			...data?.pageParam,
			acc: profileData?.bankDetails?.[selectedAccount]?.accNO
		});
		await goto(`${base}/autopay/manage/setup?params=${encodeObject}`, {
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
					amount={String(getMandateAmount(mode, mandateAmount))}
					onErrorCallback={onAutopaySetupFail}
					{onSuccessCallback}
					onPendingCallback={onAutopaySetupFail}
					profileData={$page?.data?.profile}
					defaultBankAccount={selectedAccount}
					{onSuccessPopupClick}
					{mode}
					{updateMode}
					{allowedPaymentMethods}
				/>
			{:else}
				{@const bankAccountsLength = profileData?.bankDetails?.length}
				{#if bankAccountsLength > 1}
					<div class="rounded-lg bg-white p-4 shadow-csm">
						<div class="mb-4 text-sm text-grey-body">
							You can't create a mandate with this Account. Still you can proceed by changing your
							account.
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
							You can't create a mandate with this Account for now.
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
					This account number doesn't belong to this client id.
				</div>
			</div>
		{/if}
	{/await}
{/await}
