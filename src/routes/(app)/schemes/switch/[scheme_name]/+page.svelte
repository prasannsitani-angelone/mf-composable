<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$components/Modal.svelte';
	import SwitchSearch from '$components/Switch/SwitchSearch.svelte';
	import type { PageData } from '../$types';
	import { SwitchOrderTitleCard, SwitchOrderTile, Button, WMSIcon, SEO } from 'wms-ui-component';
	import SwitchInFundSelection from './SwitchInFundSelection/SwitchInFundSelection.svelte';
	import type { FolioHoldingType, FolioObject } from '$lib/types/IInvestments';
	import { NomineeUpdateLinks } from '$components/NomineeUpdate/constants';
	import CheckboxCheckedIcon from '$lib/images/icons/CheckboxCheckedIcon.svelte';
	import CheckboxUncheckedIcon from '$lib/images/icons/CheckboxUncheckedIcon.svelte';
	import { addCommasToAmountString, formatAmount } from '$lib/utils/helpers/formatAmount';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { base } from '$app/paths';
	import { encodeObject } from '$lib/utils/helpers/params';
	import InfoPopup from '$components/Popup/InfoPopup.svelte';
	import SwitchCue from './SwitchCue/SwitchCue.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import {
		blockedUnitsSwitchFolioAnalytics,
		folioConfirmSwitchAnalytics,
		proceedForSwitchClickAnalytics,
		selectSwitchInFundClickAnalytics,
		switchConfirmationScreenAnalytics,
		switchFolioDataAnalytics,
		switchFullAmountClickAnalytics
	} from '$lib/analytics/switch/switch';
	import {
		changeFolioAnalytics,
		withdrawableAmountLessThanMinimumLimitAnalytics
	} from '$lib/analytics/redemption/redemption';
	import FolioSelection from '$components/MultipleFolios/FolioSelection.svelte';
	import NomineeUpdateCard from '$components/NomineeUpdate/NomineeUpdateCard.svelte';
	import FolioSelectionSwitch from './FolioSelectionSwitch/FolioSelectionSwitch.svelte';
	import ErrorPage from '$components/ErrorPage.svelte';
	import SwitchSkeletonLoader from './SwitchSkeletonLoader.svelte';

	$: redemableAmount = selectedFolio?.redemableAmount;
	$: amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	$: switchInFund = <SchemeDetails>{};
	$: selectSwitchFund = false;

	let amount = '';

	let isRedeemableAmountLessThanWithdrawableAmount = false;

	// let folioList: Array<FolioObject>;
	let selectedFolio: FolioObject;
	let switchFullAmount = false;

	let errorMessage = '';
	let fullAmountSelected = false;
	let showSwitchableAmountInfo = false;
	let showSwitchCue = false;
	$: dpError = false;
	let showSwitchableAmountDetails = false;
	let showFolioSelection = false;

	let numberOfUnits = 0;

	$: folioList = <Array<FolioObject>>[];
	$: selectedFolio = (folioList || [])[0];
	$: minimumRedeemAmount = switchInFund?.minimumRedeemAmount;
	$: redeemMultiplierAmount = switchInFund?.redeemMultiplier;
	$: redemableUnits = selectedFolio?.redemableUnits;
	$: minimumSwitchInAmount = switchInFund?.minLumpsumAmount * 1.025;
	$: maxmumSwitchInAmount = switchInFund?.lumpsumMaxAmount;

	function updateFolios(folio: FolioHoldingType) {
		folioList = folio?.folioHoldings || [];
		folioList = folioList?.sort((a, b) => (a.redemableAmount < b.redemableAmount ? -1 : 1));
		selectedFolio = (folioList || [])[0];

		return '';
	}
	const toggleModal = () => {
		selectSwitchFund = selectSwitchFund ? false : true;
		if (selectSwitchFund) {
			selectSwitchInFundClickAnalytics();
		}
	};

	const optInSwitchScheme = (e: { detail: SchemeDetails }) => {
		switchInFund = e.detail;
		dpError = false;
		if (redemableAmount < minimumRedeemAmount || redemableAmount < minimumSwitchInAmount) {
			isRedeemableAmountLessThanWithdrawableAmount = true;
		}
		if (switchInFund?.schemeName && switchInFund?.schemeName.length > 0) {
			amountVal = '';
			errorMessage = '';
			switchFullAmount = false;
		}
		if (
			(profileStore?.accountType() === 'D' &&
				switchInFund?.purchaseTxnMode === 'D' &&
				selectedFolio?.dpFlag === 'N') ||
			(profileStore?.accountType() === 'P' &&
				switchInFund?.purchaseTxnMode === 'P' &&
				selectedFolio?.dpFlag === 'Y')
		) {
			dpError = true;
		}
	};

	const switchableAmountDetailsInfoTagClick = () => {
		showSwitchableAmountDetails = !showSwitchableAmountDetails;
		if (showSwitchableAmountDetails) {
			const eventMetaData = {
				WithDrawableAmount: selectedFolio?.redemableAmount,
				BlockedAmount: selectedFolio?.blockedAmount
			};
			blockedUnitsSwitchFolioAnalytics(eventMetaData);
		}
	};

	const resetAmountVal = () => {
		amountVal = '0';
		amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	};
	const calculateNumberOfUnits = () => {
		numberOfUnits = parseFloat(
			(parseFloat(amount) / (redemableAmount / redemableUnits))?.toString()
		);
	};

	const setErrorMessage = () => {
		if (
			parseFloat(amount) < parseFloat(minimumRedeemAmount?.toFixed(2)) ||
			parseFloat(amount) < parseFloat(minimumSwitchInAmount?.toFixed(2))
		) {
			errorMessage =
				'Minimum Amount: ₹' + Math.max(minimumRedeemAmount, minimumSwitchInAmount).toFixed(2);
		} else if (
			parseFloat(amount) > parseFloat(redemableAmount?.toFixed(2)) ||
			parseFloat(amount) > parseFloat(maxmumSwitchInAmount?.toFixed(2))
		) {
			errorMessage =
				'Maximum Withdrawable Amount: ₹' +
				(addCommasToAmountString(redemableAmount?.toFixed(2)) || redemableAmount);
		} else if (!fullAmountSelected && parseInt(parseInt(amount) % redeemMultiplierAmount)) {
			errorMessage = `Please withdraw in multiples of ₹${redeemMultiplierAmount}`;
		} else {
			errorMessage = '';
		}
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

	const handleFullAmountClick = (inputBasedToggle = false) => {
		if (isRedeemableAmountLessThanWithdrawableAmount || dpError) {
			return;
		}

		fullAmountSelected = !fullAmountSelected;

		const eventMetadata = {
			SwitchFullAmount: fullAmountSelected ? 'Yes' : 'No'
		};
		switchFullAmountClickAnalytics(eventMetadata);

		if (inputBasedToggle) {
			return;
		}

		const fullAmountString = redemableAmount.toFixed(2);

		if (fullAmountSelected) {
			amount = fullAmountString;
			switchFullAmount = true;
		} else {
			amount = '';
			switchFullAmount = false;
		}

		calculateNumberOfUnits();
		setErrorMessage();
	};

	const selectFolioDropdownAnalytics = () => {
		const eventMetadata = {
			CurrentFolio: selectedFolio?.folioNumber
		};

		changeFolioAnalytics(eventMetadata);
	};

	const toggleFolioSelection = (val = false) => {
		showFolioSelection = val;

		if (showFolioSelection) {
			switchFolioDataAnalytics(folioList);
			selectFolioDropdownAnalytics();
		}
	};

	const handleFooterCtaClick = (folioHolding: FolioHoldingType) => {
		if (!amount?.length || !!errorMessage?.length) {
			return;
		}
		const params = encodeObject({
			folioList: folioList,
			numberOfUnits: numberOfUnits,
			amount: amount,
			selectedFolio: selectedFolio,
			folioHolding: folioHolding,
			switchInFund: {
				schemeName: switchInFund?.schemeName,
				logoUrl: switchInFund?.logoUrl,
				isin: switchInFund?.isin,
				schemeCode: switchInFund?.schemeCode
			},
			fullAmountSelected
		});
		goto(`${base}/schemes/switch/confirm?params=${params}`);
		proceedForSwitchClickAnalytics();
		const eventMetaData = {
			SwitchOutFund: folioHolding?.schemeName,
			SwitchinFund: switchInFund?.schemeName,
			SwitchAmount: amount,
			Units: numberOfUnits
		};
		switchConfirmationScreenAnalytics(eventMetaData);
	};

	const handleSwitchAbleCloseModal = () => {
		showSwitchableAmountInfo = !showSwitchableAmountInfo;
	};

	const toggleSwitchCue = () => {
		showSwitchCue = !showSwitchCue;
	};

	const setSelectedFolio = (folioNumber: string) => {
		const selectedFolioObject = folioList?.find((folio) => folio?.folioNumber === folioNumber);
		if (selectedFolioObject) {
			selectedFolio = selectedFolioObject;
		}
		showFolioSelection = false;
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

	const setFolioWithdrawalData = (folioNumber: string) => {
		setSelectedFolio(folioNumber);
		redemableAmount = selectedFolio?.redemableAmount;
		redemableUnits = selectedFolio?.redemableUnits;
		errorMessage = '';
		amountVal = '';
		amount = '';
		fullAmountSelected = false;
		redeemableAmountLessThanWithdrawableAmountFunc();
		const eventMetaData = {
			FolioNumber: selectedFolio?.folioNumber,
			SwitchableValue: selectedFolio?.redemableAmount
		};
		folioConfirmSwitchAnalytics(eventMetaData);
	};

	export let data: PageData;
</script>

{#await data.api.folioHolding}
	<SwitchSkeletonLoader />
{:then folioHolding}
	{(() => updateFolios(folioHolding))()}
	{#if folioHolding?.schemeName}
		<SEO
			seoTitle={`${folioHolding?.schemeName} - Switch Funds | Angel One`}
			seoDescription={`${folioHolding?.schemeName} - Switch Funds | Angel One`}
		/>
		<div>
			<SwitchOrderTitleCard
				switchOutSchemeName={folioHolding?.schemeName}
				switchOutLogo={folioHolding?.logoUrl}
				switchInLogo={folioHolding?.logoUrl}
				switchInSchemeName={folioHolding?.schemeName}
			>
				<div slot="switchOut">
					<SwitchOrderTile
						logoUrl={folioHolding?.logoUrl}
						schemeName={folioHolding?.schemeName}
						orderTypeText="SWITCH OUT"
						orderTypeBgColor="bg-yellow-primary"
					>
						<footer slot="footer" class="mb-6 flex justify-between bg-grey px-4 py-2">
							<div class="flex">
								<div class="text-sm text-grey-body">Current Value</div>

								{#if folioList?.length > 1}
									<article
										class="mx-1 rounded-sm px-1 py-0.5 text-[10px] text-black-title"
										style="background-color: rgba(63, 91, 217, 0.12)"
									>
										{folioList?.length} FOLIOS
									</article>
								{/if}
							</div>
							<div class="flex items-center text-black-title">
								<span class="text-sm"> ₹{folioHolding?.currentValue?.toFixed(2)}</span>
								<WMSIcon
									height={16}
									width={16}
									class="ml-1 cursor-pointer"
									name="info-in-circle"
									on:click={handleSwitchAbleCloseModal}
								/>
							</div>
						</footer>
					</SwitchOrderTile>
				</div>

				<div slot="switchIn">
					{#if switchInFund && Object.keys(switchInFund).length === 0}
						<SwitchInFundSelection {toggleModal} {toggleSwitchCue} />
					{:else}
						<SwitchOrderTile
							logoUrl={switchInFund?.logoUrl}
							schemeName={switchInFund?.schemeName}
							orderTypeText="SWITCH IN"
							orderTypeBgColor="bg-purple-primary"
						>
							<div class="flex items-center justify-center border-t border-grey-line" slot="footer">
								<Button
									variant="transparent"
									color="primary"
									class="!font-medium"
									on:click={toggleModal}
								>
									CHANGE
								</Button>
							</div>
						</SwitchOrderTile>
					{/if}
				</div>
			</SwitchOrderTitleCard>

			{#if switchInFund && Object.keys(switchInFund).length !== 0}
				<FolioSelectionSwitch
					{folioList}
					{selectedFolio}
					{toggleFolioSelection}
					{redemableAmount}
				/>
				<section class=" mb-2 mt-0.5 rounded rounded-b-lg bg-white p-4 shadow-csm md:p-4">
					{#if selectedFolio?.blockedunits > 0}
						<section class="mb-2.5 flex items-center justify-between font-medium">
							<article class="flex items-center justify-start text-black-title">
								<div class="text-xs text-black-title">Switchable Amount</div>
								<WMSIcon
									height={16}
									width={16}
									class="ml-1 cursor-pointer"
									name="info-in-circle"
									on:click={switchableAmountDetailsInfoTagClick}
								/>
							</article>

							<article>
								<span class="text-sm text-black-title">
									₹{addCommasToAmountString(redemableAmount?.toFixed(2))}
								</span>
							</article>
						</section>
					{/if}
					<div
						class="cursor-not-allowed pb-2 text-xs {isRedeemableAmountLessThanWithdrawableAmount ||
						dpError
							? 'text-gray-400'
							: ''}"
					>
						<div>Enter Amount</div>
					</div>
					<article>
						<div
							class="mb-3 flex w-full cursor-text items-center justify-start rounded border border-gray-200 px-3 py-2"
						>
							<input
								id="switchAmountInput"
								inputmode="numeric"
								maxlength="13"
								placeholder="₹"
								value={amountVal}
								class="w-full bg-white text-base font-medium leading-none text-black-title outline-none"
								on:input={onInputChange}
								size={amountVal.length + 1}
								disabled={isRedeemableAmountLessThanWithdrawableAmount || dpError}
							/>
						</div>
						{#if dpError}
							<article class="flex justify-center pt-1 pb-3">
								<p class="text-xs font-light text-red-sell">
									Switch not allowed in the selected scheme
								</p>
							</article>
						{/if}
						{#if errorMessage?.length}
							<article class="flex justify-center pt-1 pb-3">
								<p class="text-xs font-light text-red-sell">
									{errorMessage}
								</p>
							</article>
						{/if}
						<article
							class="flex w-fit items-center justify-start pt-1 text-xs font-medium text-grey-body {isRedeemableAmountLessThanWithdrawableAmount ||
							dpError
								? 'cursor-not-allowed'
								: 'cursor-pointer'}"
							on:click={() => handleFullAmountClick()}
							on:keypress={() => {
								return '';
							}}
						>
							{#if switchFullAmount}
								<span class="ml-1 mr-2">
									<CheckboxCheckedIcon />
								</span>
							{:else}
								<span class="mr-1">
									<CheckboxUncheckedIcon />
								</span>
							{/if}
							<span
								class="text-black-neutral md:text-black-title {isRedeemableAmountLessThanWithdrawableAmount ||
								dpError
									? 'cursor-not-allowed text-gray-400'
									: 'cursor-pointer'}"
							>
								Switch Full Amount
							</span>
						</article>
					</article>
				</section>
			{/if}
		</div>

		<!-- Nominee Update Card -->
		{#if switchInFund && Object.keys(switchInFund).length !== 0}
			<section class="mb-20">
				{#if selectedFolio?.dpFlag?.toUpperCase() === 'N' && (selectedFolio?.rta === 'CAMS' || selectedFolio?.rta === 'KARVY')}
					<NomineeUpdateCard
						rta={selectedFolio?.rta}
						redirectLink={selectedFolio?.rta === 'CAMS'
							? NomineeUpdateLinks?.CAMS
							: NomineeUpdateLinks?.KARVY}
						textForButton="UPDATE NOW"
					>
						<svelte:fragment slot="icon">
							<WMSIcon width={56} height={64} name="alert-icon" />
						</svelte:fragment>
					</NomineeUpdateCard>
				{/if}
			</section>
		{/if}

		{#if switchInFund && Object.keys(switchInFund).length !== 0}
			<section class="mx-3 mt-4 block md:hidden">
				<section class="fixed inset-0 top-auto bg-white px-4 py-3">
					<Button
						class="bottom-0 h-12 w-full rounded disabled:bg-grey-line disabled:bg-opacity-100 disabled:text-grey-disabled"
						disabled={!amountVal?.length || !!errorMessage?.length}
						on:click={() => handleFooterCtaClick(folioHolding)}
					>
						PROCEED
					</Button>
				</section>
			</section>
		{/if}

		<!-- All PopUps of Page  -->
		<Modal isModalOpen={selectSwitchFund}>
			<SwitchSearch
				{toggleModal}
				on:optInSwitchScheme={optInSwitchScheme}
				amccode={folioHolding?.amcCode}
				isin={folioHolding?.isin}
			/>
		</Modal>
		<!-- Amount PopUp -->
		<InfoPopup
			isModalOpen={showSwitchableAmountInfo}
			heading="Current Value"
			detailText="Current value is based on the NAV of the mutual fund as on the last working day. The actual fund value may be higher or lower based on today's NAV."
			closeModal={handleSwitchAbleCloseModal}
		>
			<svelte:fragment slot="crossIconSlot">
				<WMSIcon
					class="md:cursor-pointer"
					name="cross-circle"
					on:click={handleSwitchAbleCloseModal}
				/>
			</svelte:fragment>
		</InfoPopup>

		<InfoPopup
			isModalOpen={showSwitchableAmountDetails}
			heading="Switchable Amount"
			detailText="Withdrawal amount may differ as exit load might be applicable as per AMC rules"
			closeModal={switchableAmountDetailsInfoTagClick}
		>
			<svelte:fragment slot="popupHeader">
				<div class="flex items-center justify-between p-4 pt-6">
					<span class="text-lg font-normal text-black-title md:text-xl">
						<div>Switchable Amount</div>
						{#if folioList?.length > 1}
							<div class="font-small text-sm text-grey-body">
								Folio No: # {selectedFolio.folioNumber}
							</div>
						{/if}
					</span>
					<slot name="crossIconSlot">
						<WMSIcon
							class="md:cursor-pointer"
							name="cross-circle"
							on:click={switchableAmountDetailsInfoTagClick}
						/>
					</slot>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="popupBody">
				<section class="m-4">
					<article class="mb-6 flex items-center justify-start">
						<WMSIcon name="unlock-green" height={40} width={40} class="mr-3" />
						<div class="flex flex-col items-start justify-center">
							<span class="text-xs font-medium text-grey-body">Available for Switch</span>
							<span class="text-base font-medium text-black-title">
								₹{addCommasToAmountString(redemableAmount?.toFixed(2))}
								<span class="text-sm font-normal text-grey-body">
									({redemableUnits?.toFixed(3)} units)
								</span>
							</span>
						</div>
					</article>

					<article class="mb-6 flex items-center justify-start">
						<WMSIcon name="lock-red" height={40} width={40} class="mr-3" />
						<div class="flex flex-col items-start justify-center">
							<span class="text-xs font-medium text-grey-body">Blocked</span>
							<span class="text-base font-medium text-black-title">
								₹{addCommasToAmountString(selectedFolio?.blockedAmount?.toFixed(2))}
								<span class="text-sm font-normal text-grey-body">
									({selectedFolio?.blockedunits?.toFixed(3)} units)
								</span>
							</span>
						</div>
					</article>

					<article
						class="font-small flex items-center justify-between rounded bg-grey px-4 py-4 text-sm text-grey-body"
					>
						<WMSIcon name="not-circle" height={25} width={25} class="mr-2" />
						<span class="px-2">
							Switch of <b>{selectedFolio?.blockedunits?.toFixed(3)} units</b> is blocked. This
							could be due to the following reasons (one or more):
							<span class="pt-3">
								<ul style="list-style-type:disc" class="px-5">
									<li>Switch or withdrawal is in progress</li>
									<li>Investment is in lock-in period</li>
									<li>Units have been pledged</li>
								</ul>
							</span>
						</span>
					</article>
				</section>
			</svelte:fragment>
		</InfoPopup>

		<!-- Switch Cue -->
		<Modal isModalOpen={showSwitchCue} closeModal={toggleSwitchCue}>
			<div
				class="animate-bottomTransition flex w-screen flex-col rounded-t-2xl rounded-b-none bg-white p-4 shadow-csm md:w-120 md:animate-none md:rounded-lg"
			>
				<SwitchCue />
				<div class="pt-4">
					<Button class="w-full" on:click={toggleSwitchCue}>CONTINUE</Button>
				</div>
			</div>
		</Modal>

		{#if showFolioSelection}
			<!-- Folio Selection screen section mobile -->
			<section class="block rounded text-grey-dark md:hidden">
				<Modal
					isModalOpen={showFolioSelection}
					on:backdropclicked={() => toggleFolioSelection(false)}
				>
					<FolioSelection
						class="w-screen rounded-t-2xl bg-white px-3 py-2"
						{folioList}
						switchInSchemeMode={switchInFund?.purchaseTxnMode}
						selectedFolioNumber={selectedFolio?.folioNumber}
						on:confirmSelectedFolio={(folioData) => setFolioWithdrawalData(folioData?.detail)}
					/>
				</Modal>
			</section>
		{/if}
	{:else}
		<ErrorPage
			heading="Fund Not Available"
			contentLine="Please explore other mutual funds on Angel one to continue investing"
			redirectUrl="/explorefunds/sip-with-100?id=101"
			textForButton="EXPLORE MUTUAL FUNDS"
		>
			<div slot="icon">
				<WMSIcon name="fund-details-error" width={173} height={160} />
			</div>
		</ErrorPage>
	{/if}
{:catch}
	<ErrorPage
		heading="Fund Not Available"
		contentLine="Please explore other mutual funds on Angel one to continue investing"
		redirectUrl="/explorefunds/sip-with-100?id=101"
		textForButton="EXPLORE MUTUAL FUNDS"
	>
		<div slot="icon">
			<WMSIcon name="fund-details-error" width={173} height={160} />
		</div>
	</ErrorPage>
{/await}
