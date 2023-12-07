<script lang="ts">
	import Button from '$components/Button.svelte';
	import CheckboxCheckedIcon from '$lib/images/icons/CheckboxCheckedIcon.svelte';
	import CheckboxUncheckedIcon from '$lib/images/icons/CheckboxUncheckedIcon.svelte';
	import DownArrowIcon from '$lib/images/icons/DownArrowIcon.svelte';
	import { headerStore } from '$lib/stores/HeaderStore';
	import type { FolioHoldingType } from '$lib/types/IInvestments';
	import { addCommasToAmountString, formatAmount } from '$lib/utils/helpers/formatAmount';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import NotAllowed from '../InvestmentPad/OrderPadComponents/NotAllowed.svelte';
	import FolioSelection from '$components/MultipleFolios/FolioSelection.svelte';
	import Modal from '$components/Modal.svelte';
	import { page } from '$app/stores';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { goto } from '$app/navigation';
	import NomineeUpdateCard from '$components/NomineeUpdate/NomineeUpdateCard.svelte';
	import { NomineeUpdateLinks } from '$components/NomineeUpdate/constants';
	import InfoModal from '$components/InfoModal.svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import type { UtilsMetaData } from '$lib/types/IRedemption';
	import WithdrawConfirmation from './WithdrawConfirmation.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getQueryParamsObj } from '$lib/utils/helpers/params';
	import type { OrderPadTypes } from '$lib/types/IOrderPad';
	import DotIcon from '$lib/images/icons/DotIcon.svelte';
	import {
		changeFolioAnalytics,
		confirmChangeFolioAnalytics,
		withdrawFullAmountCheckboxAnalytics,
		withdrawProceedButtonClickAnalytics,
		withdrawableAmountLessThanMinimumLimitAnalytics,
		withdrawableAmountModalCloseButtonAnalytics,
		withdrawableAmountModalOpenAnalytics
	} from '$lib/analytics/redemption/redemption';

	export let holdingDetails = <FolioHoldingType>{};
	export let isRedemptionNotAllowed = false;
	export let redemptionNotAllowedText = '';
	export let isInvestmentNotAllowed = false;

	let bankDetails = $profileStore?.bankDetails;
	let primaryBankAccountIndex = profileStore?.primaryBankAccountIndex();
	let amount = '';
	let errorMessage = '';
	let fullAmountSelected = false;
	let showCurrentValueTooltip = false;
	let showWithdrawableAmountTooltip = false;
	let isRedeemableAmountLessThanWithdrawableAmount = false;
	let numberOfUnits = 0;
	let showFolioSelection = false;
	let showWithdrawConfirmation = false;
	let folioList = holdingDetails?.folioHoldings?.sort((a, b) =>
		a.redemableAmount < b.redemableAmount ? -1 : 1
	);
	let selectedFolio = (folioList || [])[0];
	let redemableAmount = selectedFolio?.redemableAmount;
	let minimumRedeemAmount = holdingDetails?.minimumRedeemAmount;
	let redeemMultiplierAmount = holdingDetails?.redeemMultiplier;
	let blockedAmount = selectedFolio?.blockedAmount;
	let redemableUnits = selectedFolio?.redemableUnits;
	let unitBlockedReasons = holdingDetails?.unitBlockedReason;
	let utilsMetaData: UtilsMetaData;
	let queryParamsObj = <OrderPadTypes>{};

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';

	const handleAmountInputFocus = () => {
		const amountInputElement = document?.getElementById('amountInput');
		amountInputElement?.focus();
	};

	const setSelectedFolio = (folioNumber: string) => {
		const selectedFolioObject = folioList?.find((folio) => folio?.folioNumber === folioNumber);
		selectedFolio = selectedFolioObject;
		showFolioSelection = false;
	};

	const setFolioWithdrawalData = (folioNumber: string) => {
		const previousFolioNumber = selectedFolio?.folioNumber;

		setSelectedFolio(folioNumber);
		redemableAmount = selectedFolio?.redemableAmount;
		blockedAmount = selectedFolio?.blockedAmount;
		redemableUnits = selectedFolio?.redemableUnits;

		amountVal = '';
		amount = '';
		fullAmountSelected = false;
		redeemableAmountLessThanWithdrawableAmountFunc();

		confirmFolioChangeAnalytics(previousFolioNumber, selectedFolio?.folioNumber);
	};

	const calculateNumberOfUnits = () => {
		numberOfUnits = parseFloat(
			(parseFloat(amount) / (redemableAmount / redemableUnits))?.toString()
		);
	};

	const handleFullAmountClick = (inputBasedToggle = false) => {
		if (isRedeemableAmountLessThanWithdrawableAmount) {
			return;
		}

		fullAmountSelected = !fullAmountSelected;

		withdrawFullAmountCheckboxAnalyticsFunc();

		if (inputBasedToggle) {
			return;
		}

		const fullAmountString = redemableAmount.toFixed(2);

		if (fullAmountSelected) {
			amount = fullAmountString;
		} else {
			amount = '';
		}

		calculateNumberOfUnits();
		setErrorMessage();
	};

	const resetAmountVal = () => {
		amountVal = '0';
		amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	};

	const onInputChange = (e) => {
		let inputValue = e.target.value;
		inputValue = formatAmount(inputValue); // trim, remove alphabets and remove leading zeroes
		resetAmountVal();
		amount = inputValue;

		const fullAmountString = redemableAmount?.toFixed(2);

		if (fullAmountString === amount && !fullAmountSelected) {
			handleFullAmountClick();
		} else if (fullAmountSelected && fullAmountString !== amount) {
			handleFullAmountClick(true);
		}

		calculateNumberOfUnits();
		setErrorMessage();
	};

	const handleInputKeydown = (event) => {
		if (fullAmountSelected && event.key === 'Backspace') {
			amount = '';

			handleFullAmountClick(true);

			calculateNumberOfUnits();
			setErrorMessage();
		}
	};

	const withdrawableAmountLessThanMinimumLimitAnalyticsFunc = () => {
		const eventMetaData = {
			value: `${redemableAmount} < ${minimumRedeemAmount}`
		};

		withdrawableAmountLessThanMinimumLimitAnalytics(eventMetaData);
	};

	const redeemableAmountLessThanWithdrawableAmountFunc = () => {
		if (redemableAmount < minimumRedeemAmount) {
			isRedeemableAmountLessThanWithdrawableAmount = true;
			fullAmountSelected = true;

			const formattedValue = redemableAmount?.toFixed(2); // trim, remove alphabets and remove leading zeroes

			amountVal = '₹' + addCommasToAmountString(formattedValue); // get amount string with commas in INR currency format
			amount = formattedValue;

			withdrawableAmountLessThanMinimumLimitAnalyticsFunc();
		} else {
			isRedeemableAmountLessThanWithdrawableAmount = false;
			fullAmountSelected = false;
		}

		calculateNumberOfUnits();
	};

	redeemableAmountLessThanWithdrawableAmountFunc();

	const setErrorMessage = () => {
		if (parseFloat(amount) < parseFloat(minimumRedeemAmount?.toFixed(2))) {
			errorMessage =
				'Minimum Amount: ₹' +
				(addCommasToAmountString(minimumRedeemAmount?.toFixed(2)) || minimumRedeemAmount);
		} else if (parseFloat(amount) > parseFloat(redemableAmount?.toFixed(2))) {
			errorMessage =
				'Maximum Withdrawable Amount: ₹' +
				(addCommasToAmountString(redemableAmount?.toFixed(2)) || redemableAmount);
		} else if (!fullAmountSelected && parseInt(parseInt(amount) % redeemMultiplierAmount)) {
			errorMessage = `Please withdraw in multiples of ₹${redeemMultiplierAmount}`;
		} else {
			errorMessage = '';
		}
	};

	const handleFooterCtaClick = () => {
		if (!amount?.length || !!errorMessage?.length) {
			return;
		}

		showWithdrawConfirmation = true;

		withdrawProceedCtaAnalytics();

		if (isMobile) {
			const currentPath = window?.location?.pathname;
			const currentQuery = window?.location?.search;
			const newQuery = 'screen=CONFIRM';
			const updatedQuery = currentQuery?.includes('?')
				? `${currentQuery}&${newQuery}`
				: `?${newQuery}`;
			const redirectPath = `${currentPath}${updatedQuery}`;

			goto(redirectPath);
		}
	};

	const setQueryParamsData = () => {
		if (isMobile) {
			if (queryParamsObj?.screen === 'CONFIRM') {
				if (amount?.length && numberOfUnits > 0) {
					showWithdrawConfirmation = true;
				} else {
					const currentPath = window?.location?.pathname;
					const redirectPath = `${currentPath}?orderpad=REDEEM`;

					goto(redirectPath);
				}
			} else {
				showWithdrawConfirmation = false;
			}
		}
	};

	afterUpdate(() => {
		queryParamsObj = getQueryParamsObj();
		setQueryParamsData();
	});

	const closeWithdrawalConfirmationScreen = () => {
		showWithdrawConfirmation = false;
	};

	const toggleCurrentValueInfoModal = () => {
		showCurrentValueTooltip = !showCurrentValueTooltip;
	};

	const toggleWithdrawableAmountInfoModal = () => {
		showWithdrawableAmountTooltip = !showWithdrawableAmountTooltip;

		if (showWithdrawableAmountTooltip) {
			withdrawableAmountModalOpenAnalyticsFunc();
		} else {
			withdrawableAmountModalCloseButtonAnalytics();
		}
	};

	const toggleFolioSelection = (val = false) => {
		showFolioSelection = val;

		if (showFolioSelection) {
			selectFolioDropdownAnalytics();
		}
	};

	const url = `${PUBLIC_MF_CORE_BASE_URL}/utils/meta`;

	const getUtilsMetaData = async () => {
		if (holdingDetails) {
			await useFetch(
				url +
					`?settlementType=${holdingDetails?.settlementType}` +
					`&schemeCode=${holdingDetails?.schemeCode}`
			).then(({ data }) => {
				utilsMetaData = data?.data;
			});
		}
	};

	getUtilsMetaData();

	onMount(() => {
		if (isMobile) {
			$headerStore.showMobileHeader = false;
		}
	});

	onDestroy(() => {
		if (isMobile) {
			$headerStore.showMobileHeader = true;
		}
	});

	const handleSchemeCardClick = () => {
		if (isInvestmentNotAllowed) {
			return;
		}

		goto(
			`../schemes/${normalizeFundName(
				holdingDetails?.schemeName,
				holdingDetails?.isin,
				holdingDetails?.schemeCode
			)}`
		);
	};

	const withdrawProceedCtaAnalytics = () => {
		const eventMetadata = {
			FundName: holdingDetails?.schemeName,
			CurrentValue: parseFloat(holdingDetails?.currentValue?.toFixed(2)),
			TotalInvestment: parseFloat(holdingDetails?.investedValue?.toFixed(2)),
			TotalReturns: parseFloat(holdingDetails?.returnsValue?.toFixed(2)),
			ReturnsPercentage: parseFloat(holdingDetails?.returnsAbsolutePer?.toFixed(2)),
			Amount: parseFloat(amount),
			FolioNumber: selectedFolio?.folioNumber,
			Value: parseFloat(
				(selectedFolio?.redemableAmount + selectedFolio?.blockedAmount)?.toFixed(2)
			),
			Units: parseFloat((selectedFolio?.redemableUnits + selectedFolio?.blockedunits)?.toFixed(3))
		};

		withdrawProceedButtonClickAnalytics(eventMetadata);
	};

	const selectFolioDropdownAnalytics = () => {
		const eventMetadata = {
			CurrentFolio: selectedFolio?.folioNumber
		};

		changeFolioAnalytics(eventMetadata);
	};

	const confirmFolioChangeAnalytics = (currentFolioNumber: string, newFolioNumber: string) => {
		const eventMetadata = {
			CurrentFolio: currentFolioNumber,
			NewFolio: newFolioNumber
		};

		confirmChangeFolioAnalytics(eventMetadata);
	};

	const withdrawFullAmountCheckboxAnalyticsFunc = () => {
		const eventMetadata = {
			WithdrawFullAmount: fullAmountSelected ? 'Yes' : 'No'
		};

		withdrawFullAmountCheckboxAnalytics(eventMetadata);
	};

	const withdrawableAmountModalOpenAnalyticsFunc = () => {
		let eventMetadataMessage = '';

		if (selectedFolio?.unitsUnderProcess > 0 && selectedFolio?.pledgedUnits > 0) {
			eventMetadataMessage = `Withdrawal of ${selectedFolio?.blockedunits?.toFixed(
				3
			)} units of this fund is blocked as they might be in progress for withdrawal and pledged or subjected to 3 years of lock in period`;
		} else if (selectedFolio?.unitsUnderProcess > 0) {
			eventMetadataMessage = `Withdrawal of ${selectedFolio?.blockedunits?.toFixed(
				3
			)} units of this fund is blocked as they might be in progress for withdrawal or subjected to 3 years of lock in period`;
		} else {
			eventMetadataMessage = `Withdrawal of ${selectedFolio?.blockedunits?.toFixed(
				3
			)} units of this fund is blocked as they are subjected to a 3 year lock in period or have been pledged`;
		}

		const eventMetadata = {
			WithdrawableAmount: `₹${selectedFolio?.redemableAmount?.toFixed(2)}`,
			WithdrawableUnits: `${selectedFolio?.redemableUnits?.toFixed(3)} Units`,
			BlockedAmount: `₹${selectedFolio?.blockedAmount?.toFixed(2)}`,
			BlockedUnits: `${selectedFolio?.blockedunits?.toFixed(3)} Units`,
			Message: eventMetadataMessage
		};

		withdrawableAmountModalOpenAnalytics(eventMetadata);
	};
</script>

<section class="rounded-b-lg md:bg-white md:py-3 {$$props?.class}">
	{#if isMobile && !$headerStore?.showMobileHeader}
		<slot name="customMobileHeader">
			<MobileHeader
				title={!showWithdrawConfirmation ? 'Withdraw' : 'Confirm Your Withdrawal'}
				showSearchIcon={false}
				showBackIcon={true}
				showCloseIcon={false}
				class="-mx-2 -mt-2 mb-2 bg-white"
			/>
		</slot>
	{/if}

	<ResultItem
		class="mb-2 rounded-lg bg-white p-2 shadow-csm md:hidden md:px-6 md:py-5 {!isInvestmentNotAllowed &&
		holdingDetails
			? 'cursor-pointer'
			: ''}"
		data={holdingDetails}
		schemeName={holdingDetails?.schemeName}
		logoUrl={holdingDetails?.logoUrl}
		categoryName={holdingDetails?.schemePlan}
		subcategoryName={holdingDetails?.sipEnabled ? 'SIP' : 'ONE-TIME'}
		titleStyle="ml-1 text-sm lg:text-lg font-normal text-black-title"
		categoryStyle="mx-1 font-normal"
		subCategoryStyle="ml-1 font-normal"
		on:click={handleSchemeCardClick}
	>
		<svelte:fragment slot="schemeInfo">
			<span />
		</svelte:fragment>
		<svelte.fragment slot="ratingSection">
			<span />
		</svelte.fragment>
		<svelte.fragment slot="returns">
			{#if !isInvestmentNotAllowed && holdingDetails}
				<span>
					<RightIcon />
				</span>
			{/if}
		</svelte.fragment>
	</ResultItem>
	{#if !showFolioSelection && !showWithdrawConfirmation && !isRedemptionNotAllowed}
		<section>
			<article
				class="mx-0 flex items-center justify-between bg-grey px-3 py-2 shadow-csm md:mx-3 md:border md:shadow-none {folioList?.length >
				1
					? 'rounded-t-lg'
					: 'rounded-lg'}"
			>
				{#if folioList?.length > 1}
					<div class="flex items-center justify-start text-sm font-normal text-grey-body">
						<span class="mr-1 text-sm text-grey-body"> Current Value </span>
						<article
							class="rounded-sm px-1 py-0.5 text-[10px] text-black-title"
							style="background-color: rgba(63, 91, 217, 0.12)"
						>
							{folioList?.length} FOLIOS
						</article>
					</div>
				{:else}
					<div class="text-sm text-grey-body">Current Value</div>
				{/if}

				<div class="flex items-center justify-center text-base font-normal text-black-title">
					<span class="text-sm md:text-base">
						₹{addCommasToAmountString(holdingDetails?.currentValue?.toFixed(2))}
					</span>
					<WMSIcon
						width={16}
						height={16}
						name="info-in-circle"
						class="ml-1 cursor-default md:cursor-pointer"
						on:click={toggleCurrentValueInfoModal}
					/>
				</div>
			</article>

			{#if folioList?.length > 1}
				<article
					class="mx-0 rounded-b-lg border-t-0 bg-white p-3 font-normal shadow-csm md:mx-3 md:border md:shadow-none"
				>
					<section class="mb-4 flex items-center justify-between">
						<div class="text-sm text-grey-body">Selected Folio</div>
						<button
							class="flex cursor-pointer items-center justify-center text-base text-black-title"
							on:click={() => toggleFolioSelection(true)}
						>
							<span>
								#{selectedFolio?.folioNumber}
							</span>
							<span class="ml-1 cursor-pointer">
								<DownArrowIcon />
							</span>
						</button>
					</section>
					<section class="flex items-center justify-between">
						<div class="text-sm text-grey-body">Folio Value</div>
						<div class="mr-3.5 text-base text-black-title">
							₹{addCommasToAmountString((redemableAmount + blockedAmount)?.toFixed(2))}
						</div>
					</section>
				</article>
			{/if}

			<section
				class="my-2 rounded-lg bg-white p-4 px-4 shadow-csm md:mx-3 md:my-4 md:border md:px-3"
			>
				{#if redemableAmount !== redemableAmount + blockedAmount}
					<!-- Withdrawable amount section -->
					<section class="mb-2.5 flex items-center justify-between font-normal">
						<article class="flex items-center justify-start text-black-title">
							<div class="text-xs text-grey-body">Withdrawable Amount</div>
							<div>
								<WMSIcon
									width={16}
									height={16}
									name="info-in-circle"
									class="ml-1 cursor-default md:cursor-pointer"
									on:click={toggleWithdrawableAmountInfoModal}
								/>
							</div>
						</article>

						<article>
							<span class="text-sm text-black-title">
								₹{addCommasToAmountString(redemableAmount?.toFixed(2))}
							</span>
						</article>
					</section>
				{/if}

				<!-- amount input -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<article
					class="mb-2 flex flex-col items-center rounded border border-gray-200 p-3 {isRedeemableAmountLessThanWithdrawableAmount
						? 'cursor-not-allowed'
						: 'cursor-text'}"
					on:click={handleAmountInputFocus}
				>
					<label
						class="mb-0.5 text-xs text-black-title {isRedeemableAmountLessThanWithdrawableAmount
							? 'cursor-not-allowed text-gray-400'
							: 'cursor-text'}"
						for="amountInput"
					>
						Enter Amount
					</label>
					<section class="flex items-baseline justify-center">
						{#if !amountVal.length}
							<sup
								class="text-xl text-gray-400 {(!amountVal.length ||
									isRedeemableAmountLessThanWithdrawableAmount) &&
									'text-gray-400'}"
							>
								₹
							</sup>
						{/if}

						<input
							id="amountInput"
							inputmode="numeric"
							value={amountVal}
							placeholder="0"
							class="border-none bg-white text-center text-4xl text-black-title outline-none first-letter:text-xl {isRedeemableAmountLessThanWithdrawableAmount
								? 'cursor-not-allowed text-gray-400'
								: 'cursor-text'} {amountVal.length ? 'max-w-fit' : 'w-6 text-gray-400'}"
							maxlength="13"
							size={amountVal.length + 1}
							disabled={isRedeemableAmountLessThanWithdrawableAmount}
							on:input={onInputChange}
							on:keydown={handleInputKeydown}
						/>
					</section>
				</article>

				{#if errorMessage?.length}
					<article class="flex justify-center py-1">
						<p class="text-xs font-light text-red-sell">
							{errorMessage}
						</p>
					</article>
				{/if}

				{#if isRedeemableAmountLessThanWithdrawableAmount}
					<article class="flex justify-center px-5 pb-4 pt-1 text-center">
						<p class="text-xs font-normal text-grey-body">
							Minimum Withdrawable Amount is <span class="font-medium text-black-title"
								>₹{minimumRedeemAmount?.toFixed(2)}</span
							>. Please withdraw full amount
						</p>
					</article>
				{/if}

				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<article
					class="flex w-fit items-center justify-start pt-1 text-xs font-normal text-grey-body {isRedeemableAmountLessThanWithdrawableAmount
						? 'cursor-not-allowed'
						: 'cursor-pointer'}"
					on:click={() => handleFullAmountClick()}
					on:keypress={() => {
						// add logic
					}}
				>
					{#if fullAmountSelected}
						<span class="ml-1 mr-2">
							<CheckboxCheckedIcon />
						</span>
					{:else}
						<span class="mr-1">
							<CheckboxUncheckedIcon />
						</span>
					{/if}
					<span class="text-black-neutral md:text-black-title"> Withdraw Full Amount </span>
				</article>
			</section>

			<!-- Update Nominee Card -->
			<section>
				{#if !showFolioSelection && !showWithdrawConfirmation && !isRedemptionNotAllowed && selectedFolio?.dpFlag?.toUpperCase() === 'N' && (selectedFolio?.rta === 'CAMS' || selectedFolio?.rta === 'KARVY')}
					<NomineeUpdateCard
						rta={selectedFolio?.rta}
						redirectLink={selectedFolio?.rta === 'CAMS'
							? NomineeUpdateLinks?.CAMS
							: NomineeUpdateLinks?.KARVY}
						textForButton="UPDATE NOW"
					>
						<svelte:fragment slot="icon">
							<WMSIcon width={64} height={64} name="alert-icon" />
						</svelte:fragment>
					</NomineeUpdateCard>
				{/if}
			</section>

			<!-- Footer Button -->
			<article class="mx-3 mt-4 hidden md:block">
				<Button
					class="w-full rounded {!amount?.length || !!errorMessage?.length || redemableAmount <= 0
						? 'cursor-default !bg-grey-line !text-grey-disabled active:opacity-100'
						: ''}"
					disabled={!amount?.length || !!errorMessage?.length || redemableAmount <= 0}
					onClick={handleFooterCtaClick}
				>
					PROCEED
				</Button>
			</article>
		</section>
	{/if}

	{#if isRedemptionNotAllowed}
		<NotAllowed class="rounded-b-lg" titleText={redemptionNotAllowedText} />
	{/if}

	{#if !showFolioSelection && !showWithdrawConfirmation}
		<!-- Withdraw button for Mobile UI -->
		<article class="mx-3 mt-4 block md:hidden">
			<section class="fixed inset-0 top-auto bg-white px-4 py-3">
				<Button
					class="bottom-0 h-12 w-full rounded {!amount?.length ||
					!!errorMessage?.length ||
					redemableAmount <= 0
						? 'cursor-default !bg-grey-line !text-grey-disabled active:opacity-100'
						: ''}"
					disabled={!amount?.length || !!errorMessage?.length || redemableAmount <= 0}
					onClick={handleFooterCtaClick}
				>
					WITHDRAW
				</Button>
			</section>
		</article>
	{/if}

	{#if showFolioSelection}
		{#if isMobile}
			<!-- Folio Selection screen section mobile -->
			<section class="rounded text-grey-dark">
				<Modal
					isModalOpen={showFolioSelection}
					on:backdropclicked={() => toggleFolioSelection(false)}
				>
					<FolioSelection
						class="w-screen rounded-t-2xl bg-white px-3 py-2"
						{folioList}
						selectedFolioNumber={selectedFolio?.folioNumber}
						on:confirmSelectedFolio={(folioData) => setFolioWithdrawalData(folioData?.detail)}
					/>
				</Modal>
			</section>
		{:else}
			<!-- Folio Selection screen section desktop -->
			<section class="rounded px-3 text-grey-dark">
				<!-- Folio List -->
				<FolioSelection
					{folioList}
					selectedFolioNumber={selectedFolio?.folioNumber}
					on:confirmSelectedFolio={(folioData) => setFolioWithdrawalData(folioData?.detail)}
				/>
			</section>
		{/if}
	{/if}

	{#if showWithdrawConfirmation}
		<!-- Withdraw Confirmation screen section -->
		<section class="mx-0 md:mx-3">
			<WithdrawConfirmation
				{holdingDetails}
				bankAccounts={bankDetails}
				selectedAccount={primaryBankAccountIndex}
				withdrawalAmount={amount}
				{numberOfUnits}
				folioData={selectedFolio}
				{utilsMetaData}
				redeemAll={fullAmountSelected}
				on:closeWithdrawalConfirmationScreen={closeWithdrawalConfirmationScreen}
			/>
		</section>
	{/if}

	{#if showCurrentValueTooltip}
		<!-- Current Value Tooltip Modal -->
		<InfoModal
			showModal={showCurrentValueTooltip}
			heading="Current Value"
			detailText={`Current value is based on the NAV of the mutual fund on the last working day. The actual current value may differ based on today's NAV`}
			on:crossClicked={toggleCurrentValueInfoModal}
		/>
	{/if}

	{#if showWithdrawableAmountTooltip}
		<!-- Withdrawable Amount Tooltip Modal -->
		<InfoModal
			showModal={showWithdrawableAmountTooltip}
			heading="Withdrawable Amount"
			detailText="Withdrawal amount may differ as exit load might be applicable as per AMC rules"
			on:crossClicked={toggleWithdrawableAmountInfoModal}
		>
			<svelte:fragment slot="headingDetails">
				<div class="flex flex-col font-normal">
					<span class="text-lg text-black-title md:text-xl"> Withdrawable Amount </span>
					<span class="text-sm text-grey-body">
						Folio No: #{selectedFolio?.folioNumber}
					</span>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="bodySection">
				<section class="m-4 md:m-8">
					<article class="mb-6 flex items-center justify-start">
						<span class="mr-3">
							<WMSIcon width={40} height={40} name="unlock-green" />
						</span>
						<div class="flex flex-col items-start justify-center">
							<span class="text-xs font-normal text-grey-body">Available To Withdraw</span>
							<span class="text-base font-normal text-black-title">
								₹{addCommasToAmountString(selectedFolio?.redemableAmount?.toFixed(2))}
								<span class="text-sm font-normal text-grey-body">
									({selectedFolio?.redemableUnits?.toFixed(3)} units)
								</span>
							</span>
						</div>
					</article>

					<article class="mb-6 flex items-center justify-start">
						<span class="mr-3">
							<WMSIcon width={40} height={40} name="lock-red" />
						</span>
						<div class="flex flex-col items-start justify-center">
							<span class="text-xs font-normal text-grey-body">Blocked</span>
							<span class="text-base font-normal text-black-title">
								₹{addCommasToAmountString(selectedFolio?.blockedAmount?.toFixed(2))}
								<span class="text-sm font-normal text-grey-body">
									({selectedFolio?.blockedunits?.toFixed(3)} units)
								</span>
							</span>
						</div>
					</article>

					<article
						class="flex items-center justify-start rounded bg-grey px-4 py-3 font-normal text-grey-body"
					>
						<span class="mr-3">
							<WMSIcon width={25} height={25} name="not-allowed-icon" />
						</span>
						<div class="text-xs font-normal">
							Withdrawal of <span class="font-normal text-black-title"
								>{selectedFolio?.blockedunits?.toFixed(3)} units</span
							>
							is blocked. This could be due to the following reasons:

							{#each unitBlockedReasons as reason}
								<section class="flex items-start">
									<DotIcon class="mx-2 mt-1.5 w-1" />
									<div>{reason}</div>
								</section>
							{/each}
						</div>
					</article>
				</section>
			</svelte:fragment>
		</InfoModal>
	{/if}
</section>
