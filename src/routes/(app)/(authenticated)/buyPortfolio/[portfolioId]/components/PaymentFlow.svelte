<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import ChangePaymentContainerWithState from '$components/Payment/ChangePaymentContainerWithState.svelte';
	import PaymentSleeveWithState from '$components/Payment/PaymentSleeveWithState.svelte';
	import {
		netBankingBulkSIPFlow,
		upiBulkSIPFlow,
		walletBulkSIPFlow
	} from '$components/Payment/flow';
	import { getFormattedSIPDate } from '$components/Payment/util';
	import { getCompleteSIPDateBasedonDD, getDateSuperscript } from '$lib/utils/helpers/date';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SkeletonLoader from '../../components/SkeletonLoader.svelte';
	import { paymentAppStore } from '$lib/stores/IntentPaymentAppsStore';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import KycProgressPopup from '$components/Payment/KYCProgressPopup.svelte';
	import { NET_BANKING_MIN_LIMIT, UPI_MAX_LIMIT } from '$components/Payment/constants';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { useFetch } from '$lib/utils/useFetch';
	import { onMount } from 'svelte';
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
	import { v4 as uuidv4 } from 'uuid';

	export let portfolioPack: PortfolioPack;
	export let amount = 0;
	export let date: number;
	$: userData = $page?.data?.userDetails;
	const profileData = $page.data?.profile;
	const upiPaymentAmountLimit = 100000;
	const minimumNetBankingAmountLimit = 50;
	const os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;

	let defaultInputPaymentError = '';
	let isKYCInProgress = false;
	export let requestId = uuidv4();

	let previousPaymentDetails = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: '',
		firstTimeUser: true
	};
	const getPreviousPaymentDetails = async () => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/user/paymentHandlers`;
			const response = await useFetch(url, {}, fetch);
			if (response.ok) {
				const data = response?.data;
				const bankDetails = profileData?.bankDetails;
				const index = profileStore.bankAccountIndexByAccountNumberOnServer(
					bankDetails,
					data?.accountNo
				);
				if (index < 0) {
					return previousPaymentDetails;
				}
				previousPaymentDetails.upiId = data?.upiId;
				previousPaymentDetails.selectedAccount = index;
				const paymentMode = data?.paymentMode;
				if (amount > UPI_MAX_LIMIT) {
					previousPaymentDetails.paymentMode = 'NET_BANKING';
				} else if (paymentMode === 'NET_BANKING' && amount < NET_BANKING_MIN_LIMIT) {
					previousPaymentDetails.paymentMode = 'UPI';
				} else if (
					(paymentMode === 'GOOGLEPAY' || paymentMode === 'PHONEPE' || paymentMode === 'PAYTM') &&
					os !== 'Android' &&
					os !== 'iOS'
				) {
					previousPaymentDetails.paymentMode = 'UPI';
				} else {
					previousPaymentDetails.paymentMode = paymentMode;
				}
				previousPaymentDetails.firstTimeUser = false;
			}
			return previousPaymentDetails;
		} catch (e) {
			return previousPaymentDetails;
		}
	};

	onMount(async () => {
		previousPaymentDetails = await getPreviousPaymentDetails();
	});

	const toggleKYCProgressPopup = () => {
		isKYCInProgress = !isKYCInProgress;
	};

	let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: '',
		firstTimeUser: true
	};
	let showChangePayment = false;

	const showPaymentMethodScreen = () => {
		showChangePayment = true;
	};

	const hidePaymentMethodScreen = () => {
		showChangePayment = false;
	};

	const assignPreviousPaymentDetails = async (promise) => {
		paymentHandler = await promise;
		paymentHandler.paymentMode =
			paymentAppStore.checkIfPaymentAppInstalledElseGetFallback(paymentHandler.paymentMode) || '';
	};

	const updatePaymentHandler = (input) => {
		paymentHandler.firstTimeUser =
			typeof input.firstTimeUser === 'boolean' ? input.firstTimeUser : paymentHandler.firstTimeUser;
		paymentHandler.paymentMode = input.paymentMode || paymentHandler.paymentMode;
		paymentHandler.selectedAccount =
			input.selectedAccount >= 0 ? input.selectedAccount : paymentHandler.selectedAccount;
		paymentHandler.upiId = input.upiId || paymentHandler.upiId;
	};

	const getSIPDate = () => {
		return getCompleteSIPDateBasedonDD(date, new Date(), 30);
	};

	const paymentFlow = async (params) => {
		if (userData?.isKycInProgress) {
			toggleKYCProgressPopup();
			return;
		}

		const schemes = portfolioPack?.schemes;

		// when first time user and first time payment true then navigate to payment method screen
		if (paymentHandler.firstTimeUser) {
			showPaymentMethodScreen();
			return;
		}

		const orders = [];
		schemes.forEach((scheme) => {
			orders.push({
				firstOrderToday: true,
				folioNumber: '',
				frequency: scheme.sipFrequency,
				installmentAmount: (amount * scheme.wieightPercentage) / 100,
				isin: scheme.isin,
				noOfInstallment: scheme.sipMaxInstallmentNo,
				schemeCode: scheme.schemeCode,
				startDate: getFormattedSIPDate(getSIPDate())
			});
		});

		const commonInput = {
			...params,
			amount,
			packId: portfolioPack.packId,
			sipDate: getSIPDate(),
			orders,
			accNO: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO,
			ifscCode: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.ifscCode,
			bankName: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			dpNumber: profileData?.dpNumber,
			fullName: profileData?.clientDetails?.fullName,
			onSuccess: successFlow
		};

		if (paymentHandler?.paymentMode === 'NET_BANKING') {
			netBankingBulkSIPFlow(commonInput);
		} else if (paymentHandler?.paymentMode === 'UPI') {
			paymentHandler.upiId = params?.inputId;
			upiBulkSIPFlow(commonInput);
		} else {
			walletBulkSIPFlow(commonInput);
		}
	};

	const navigateToOrders = async () => {
		await goto(`${base}/orders/orderspage`, { replaceState: true });
	};

	const successFlow = () => {
		navigateToOrders();
	};

	const upiValidationErrorFuncPS = (error) => {
		defaultInputPaymentError = error;
		showPaymentMethodScreen();
	};

	const clearInputPaymentErrorPC = () => {
		defaultInputPaymentError = '';
	};

	const updatePaymentMode = (amount: string) => {
		if (
			(paymentHandler?.paymentMode === 'GOOGLEPAY' ||
				paymentHandler?.paymentMode === 'PHONEPE' ||
				paymentHandler?.paymentMode === 'PAYTM' ||
				paymentHandler?.paymentMode === 'UPI') &&
			parseInt(amount) > upiPaymentAmountLimit
		) {
			paymentHandler.paymentMode = 'NET_BANKING';
		} else if (
			paymentHandler?.paymentMode === 'NET_BANKING' &&
			parseInt(amount) < minimumNetBankingAmountLimit
		) {
			paymentHandler.paymentMode = 'UPI';
		}
	};

	$: updatePaymentMode(amount.toString());
</script>

{#await portfolioPack}
	<SkeletonLoader />
{:then portfolioPack}
	{#if !showChangePayment}
		<article class="flex h-full flex-col justify-between overflow-y-hidden">
			<!-- footer  -->
			{#await assignPreviousPaymentDetails(previousPaymentDetails)}
				<div />
			{:then}
				<section class="flex w-full flex-row bg-white px-4 py-3">
					<PaymentSleeveWithState
						amount={amount.toString()}
						{paymentHandler}
						{requestId}
						bankAccounts={profileData?.bankDetails}
						{showPaymentMethodScreen}
						{paymentFlow}
						pendingFlow={successFlow}
						upiValidationErrorFunc={upiValidationErrorFuncPS}
						submitButtonText={paymentHandler?.firstTimeUser
							? 'CONTINUE'
							: `PAY ₹${addCommasToAmountString(amount)}`}
					/>
				</section>
			{/await}
		</article>
	{:else}
		<ChangePaymentContainerWithState
			allowedPaymentmethods={$paymentAppStore.allPaymentApps}
			amount={amount.toString()}
			{paymentHandler}
			bankAccounts={profileData?.bankDetails}
			{hidePaymentMethodScreen}
			{updatePaymentHandler}
			{paymentFlow}
			pendingFlow={successFlow}
			{defaultInputPaymentError}
			clearInputPaymentError={clearInputPaymentErrorPC}
			class="h-screen w-full md:h-[840px] md:w-[400px]"
		>
			<div slot="schemeTile" class="flex flex-col">
				<div class="flex w-full flex-col bg-white px-3 py-4">
					<div class="flex flex-row">
						<div class="mr-2 flex max-w-[56px] flex-row">
							<SchemeLogo
								class="!mr-0"
								size="xs"
								src={portfolioPack.schemes?.[0].logoUrl}
								alt="scheme logo"
							/>
							{#if portfolioPack.schemes?.length > 1}
								<div
									class="relative left-[-16px] flex h-9 w-9 min-w-[36px] flex-row items-center justify-center rounded-full border border-grey-line bg-white text-xs shadow-csm"
								>
									+ {portfolioPack.schemes?.length - 1}
								</div>
							{/if}
						</div>
						<div class="flex w-full flex-row items-center justify-between text-sm font-normal">
							<div>{portfolioPack.schemes?.length} Mutual Funds</div>
							<div>₹{addCommasToAmountString(amount)}</div>
						</div>
					</div>
					<div class="mt-2 text-xs text-black-title">
						Monthly SIP Date: {date}{getDateSuperscript(date)}
					</div>
				</div>
				<div class="bg-grey pb-2" />
			</div>
		</ChangePaymentContainerWithState>
	{/if}
{:catch}
	<div class="flex h-full flex-col items-center self-center px-4 py-4">
		<div class="mb-4 text-center text-base font-normal text-black-title">
			We are facing some issue at our end. Please try again or contact field support
		</div>
		<Button variant="transparent" class="mt-6 w-max self-center" onClick={navigateToOrders}>
			GO TO ORDERS
		</Button>
	</div>
{/await}

{#if isKYCInProgress}
	<KycProgressPopup onClose={toggleKYCProgressPopup} onSubmit={toggleKYCProgressPopup} />
{/if}
