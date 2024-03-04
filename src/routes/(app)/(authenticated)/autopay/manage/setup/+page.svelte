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
	import { WMSIcon } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { paymentAppStore } from '$lib/stores/IntentPaymentAppsStore';
	import { appStore } from '$lib/stores/SparkStore';
	import { goBackToSpark } from '$lib/utils';

	export let data;
	let selectedAccount: number;
	let mode = '';
	let bankPopupVisible = false;
	let allowedPaymentMethods: Array<string> = [];

	$: profileData = $page?.data?.profile;
	$: os = $page.data?.deviceType?.osName || $page.data?.deviceType?.os;

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
		const paramMode = data?.pageParam?.mode;
		const deviceType = $page.data?.deviceType;
		const os = deviceType?.osName || deviceType?.os;
		if (paramMode && allowedPaymentMethods?.includes(paramMode)) {
			mode = paramMode;
		} else if (os === 'Android' && allowedPaymentMethods?.includes('PHONEPE')) {
			mode = 'PHONEPE';
		} else if ((os === 'Android' || os === 'iOS') && allowedPaymentMethods?.includes('GOOGLEPAY')) {
			mode = 'GOOGLEPAY';
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

			if (!data?.pageParam?.mandateType || data?.pageParam?.mandateType?.toLowerCase() !== 'upi') {
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
		}
		allowedPaymentMethods = $paymentAppStore.allPaymentApps.filter((value) =>
			allowedPaymentMethods.includes(value)
		);
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
		if ($appStore.openViaTabView) {
			goBackToSpark();
		} else {
			await goto(`${base}/discoverfunds`, { replaceState: true });
		}
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
			acc: profileData?.bankDetails?.[selectedAccount]?.accNO,
			mode
		});
		await goto(`${base}/autopay/manage/setup?params=${params}`, {
			replaceState: true
		});
	};

	const handleGoBackCtaClick = () => {
		history?.back();
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
				<TopCard {totalAmount} />
				<div class="mb-2" />
				<Mandate
					onStart={intiateAutoPayProcess}
					amount={String(mandateAmount)}
					onErrorCallback={onAutopaySetupFail}
					{onSuccessCallback}
					onPendingCallback={() => {
						//
					}}
					profileData={$page?.data?.profile}
					defaultBankAccount={selectedAccount}
					{onSuccessPopupClick}
					{mode}
					{updateMode}
					{allowedPaymentMethods}
					onAccChange={onAccountChange}
					{os}
				/>
			{:else}
				{@const bankAccountsLength = profileData?.bankDetails?.length}
				<div class="rounded-lg bg-background-alt px-2 py-12 shadow-csm">
					<WMSIcon name="red-exclamation-thin" height={92} width={92} class="mx-auto" />

					<div class="mx-1 mt-6 text-center text-sm font-normal text-title">
						{#if bankAccountsLength > 1}
							<div>
								Your bank does not support Autopay. Please set up autopay with a different bank
								account.
							</div>

							<div class="mt-4">
								If none of your bank accounts work, please complete your SIP payment manually on the
								SIP date.
							</div>

							<article class="mt-6">
								<BankTile
									bankLogo={profileData?.bankDetails?.[selectedAccount]?.bankLogo}
									bankName={profileData?.bankDetails?.[selectedAccount]?.bankName}
									selectedBankAccount={profileData?.bankDetails?.[selectedAccount]?.accNO}
									bankAccounts={bankAccountsLength}
								>
									<svelte:fragment slot="dropdown-icon">
										<span />
									</svelte:fragment>

									<svelte:fragment slot="right-section">
										<ButtonMedium
											class="mr-3 px-0 !text-xs !font-medium text-primary"
											variant="transparent"
											on:click={showBankSelectionPopup}>CHANGE</ButtonMedium
										>
									</svelte:fragment>
								</BankTile>
							</article>
						{:else}
							<div>
								Your bank does not support Autopay. Please complete your SIP payment manually on the
								SIP date.
							</div>

							<article class="mt-6 text-center">
								<ButtonMedium
									class="mr-3 !h-0 !min-h-0 px-0 !text-sm !font-medium text-primary"
									variant="transparent"
									on:click={handleGoBackCtaClick}>GO BACK</ButtonMedium
								>
							</article>
						{/if}
					</div>
				</div>

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
			<div class="rounded-lg bg-background-alt p-4 shadow-csm">
				<div class="text-sm text-title">
					A technical error occurred while setting up an AutoPay. Please try again later.
				</div>
			</div>
		{/if}
	{/await}
{/await}
