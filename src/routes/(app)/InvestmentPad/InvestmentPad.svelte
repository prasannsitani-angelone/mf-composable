<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { headerStore } from '$lib/stores/HeaderStore';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import Button from '$components/Button.svelte';
	import NumPad from '$components/Keyboard/NumPad.svelte';
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import CheckboxCheckedIcon from '$lib/images/icons/CheckboxCheckedIcon.svelte';
	import CheckboxUncheckedIcon from '$lib/images/icons/CheckboxUncheckedIcon.svelte';
	import { addCommasToAmountString, formatAmount } from '$lib/utils/helpers/formatAmount';
	import TabNotSupported from './OrderPadComponents/TabNotSupported.svelte';
	import {
		getDateSuperscript,
		getSIPMonthBasedOnDate,
		getSIPYearBasedOnDate
	} from '$lib/utils/helpers/date';
	import CalendarComponent from '$components/Calendar/CalendarComponent.svelte';
	import NextSipDate from '$components/Calendar/NextSipDate.svelte';
	import Modal from '$components/Modal.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import type { dateArrayTypes } from '$lib/types/Calendar/ICalendar';
	import type { decodedParamsTypes } from '$lib/types/IOrderPad';
	import TncModal from '$components/TnC/TncModal.svelte';

	export let schemeData: SchemeDetails;
	export let fromInvestmentDetailsPage: boolean;
	export let params: decodedParamsTypes = {};

	const {
		investmentType,
		investmentAmount,
		sipDate,
		ftp,
		skipOrderPad,
		redirectedFrom
		// orderId,
		// pgTxnId,
		// requestId,
		// sipId,
		// sipRegistrationNumber,
		// sipDueDate,
		// source
	} = params || {};

	const sipPrefillAmount = 100;
	const lumpsumPrefillAmount = 100;
	const maximumAmountLimit = 999999999;

	let activeTab = 'SIP';
	let amount = '';
	let showCalendar = false;
	let sipAllowedDaysArray = schemeData?.sipAllowedDays?.trim()?.split(',') || [];
	let dateSuperscript = 'th';
	let calendarDate = new Date(schemeData?.sipDate)?.getDate();
	let calendarMonth = new Date(schemeData?.sipDate)?.toLocaleString('default', { month: 'short' });
	let calendarYear = new Date(schemeData?.sipDate)?.getFullYear();
	let tempCalendarDate = calendarDate;
	let tempCalendarMonth = calendarMonth;
	let tempCalendarYear = calendarYear;
	let errorMessage = '';
	let firstSipPayment = true;
	let showTncModal = false;

	$: amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	$: showTabNotSupported = false;
	$: tabNotSupportedType = '';
	$: isMobile = $page?.data?.deviceType?.isMobile;

	let dateArray: Array<dateArrayTypes> = [{ value: 1, disabled: false }];

	$: {
		dateArray.pop();

		for (let i = 1; i <= 28; i++) {
			dateArray.push({
				value: i,
				disabled: (sipAllowedDaysArray || []).findIndex((d: string) => parseInt(d) === i) === -1
			});
		}
	}

	const toggleFirstSipPayment = () => {
		firstSipPayment = !firstSipPayment;
		setNextSipDate();
	};

	const setErrorMessage = () => {
		if (!amount?.length || !Number(amount)) {
			errorMessage = 'Amount should be more than 0';
			return;
		}

		if (activeTab === 'SIP') {
			if (parseInt(amount) < schemeData?.minSipAmount) {
				errorMessage =
					'Min SIP Amount: ₹' +
					(addCommasToAmountString(schemeData?.minSipAmount?.toString()) ||
						schemeData?.minSipAmount);
			} else if (parseInt(amount) > schemeData?.sipMaxAmount) {
				errorMessage =
					'Max SIP Amount: ₹' +
					(addCommasToAmountString(schemeData?.sipMaxAmount?.toString()) ||
						schemeData?.sipMaxAmount);
			} else if (parseInt(parseInt(amount) % schemeData?.sipMultiplierAmount)) {
				errorMessage = `Please invest in multiples of ₹${schemeData?.sipMultiplierAmount}`;
			} else {
				errorMessage = '';
			}
		} else if (activeTab === 'ONETIME') {
			if (
				redirectedFrom !== 'INVESTMENT_DETAILS' &&
				!fromInvestmentDetailsPage &&
				parseInt(amount) < schemeData?.minLumpsumAmount
			) {
				errorMessage =
					'Min Investment Amount: ₹' +
					(addCommasToAmountString(schemeData?.minLumpsumAmount?.toString()) ||
						schemeData?.minLumpsumAmount);
			} else if (
				(redirectedFrom === 'INVESTMENT_DETAILS' || fromInvestmentDetailsPage) &&
				parseInt(amount) < schemeData?.additionalPurchaseAmount
			) {
				errorMessage =
					'Min Investment Amount: ₹' +
					(addCommasToAmountString(schemeData?.additionalPurchaseAmount?.toString()) ||
						schemeData?.additionalPurchaseAmount);
			} else if (
				schemeData?.lumpsumMaxAmount > 0 &&
				parseInt(amount) > schemeData?.lumpsumMaxAmount
			) {
				errorMessage =
					'Max Investment Amount: ₹' +
					(addCommasToAmountString(schemeData?.lumpsumMaxAmount?.toString()) ||
						schemeData?.lumpsumMaxAmount);
			} else if (parseInt(parseInt(amount) % schemeData?.lumpsumMultiplierAmount)) {
				errorMessage = `Please invest in multiples of ₹${schemeData?.lumpsumMultiplierAmount}`;
			} else {
				errorMessage = '';
			}
		}
	};

	const handleShowTabNotSupported = () => {
		if (activeTab === 'SIP') {
			showTabNotSupported = schemeData?.isSipAllowed !== 'Y';
			tabNotSupportedType = 'SIP';
		} else if (activeTab === 'ONETIME') {
			showTabNotSupported = schemeData?.isLumpsumAllowed !== 'Y';
			tabNotSupportedType = 'One time';
		}
	};

	const setDefaultSipDate = () => {
		let areAllDaysAllowed = true;
		for (let i = 1; i <= 28; i++) {
			if (parseInt(sipAllowedDaysArray[i - 1]) !== i) {
				areAllDaysAllowed = false;
			}
		}

		if (areAllDaysAllowed) {
			calendarDate = 4;
		} else if (sipAllowedDaysArray?.length) {
			calendarDate = parseInt(sipAllowedDaysArray[0]);
		} else {
			calendarDate = 1;
		}
		dateSuperscript = getDateSuperscript(calendarDate);
	};

	setDefaultSipDate();

	const setNextSipDate = () => {
		const now = new Date();
		const month = getSIPMonthBasedOnDate(calendarDate, now, firstSipPayment ? 30 : 10);
		calendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});
		calendarYear = getSIPYearBasedOnDate(calendarDate, now, firstSipPayment ? 30 : 10);
	};

	setNextSipDate();

	const handleAmountInputFocus = () => {
		const amountInputElement = document?.getElementById('amountInput');
		amountInputElement?.focus();
	};

	const resetAmountVal = () => {
		amountVal = '0';
		amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	};

	const onInputChange = (val: string | object) => {
		let inputValue = val;

		if (isMobile) {
			if (!val || typeof val === 'object') {
				resetAmountVal();
				return;
			}
		} else {
			if (val && typeof val === 'object') {
				inputValue = val?.target?.value;
				inputValue = formatAmount(inputValue); // trim, remove alphabets and remove leading zeroes

				if (inputValue === amount) {
					resetAmountVal();
					return;
				}
			}
		}

		amount = formatAmount(inputValue); // trim, remove alphabets and remove leading zeroes

		setErrorMessage();
	};

	$: onInputChange(amount); // for on-screen numpad amount input

	const prefillParamsData = () => {
		if (investmentType) {
			activeTab = investmentType === 'LUMPSUM' ? 'ONETIME' : 'SIP';
		}
		if (investmentAmount) {
			amount = investmentAmount?.toFixed(0);
			setErrorMessage();
		}
		if (typeof ftp === 'boolean') {
			firstSipPayment = ftp;
		}
		if (sipDate) {
			calendarDate = sipDate;
			dateSuperscript = getDateSuperscript(sipDate);
			setNextSipDate();
		}
		if (skipOrderPad && (ftp || activeTab === 'ONETIME')) {
			// TODO
			// add logic for skip order pad and directly show payment mode page/modal
		}
	};

	const prefillAmount = () => {
		if (activeTab === 'SIP') {
			if (schemeData?.minSipAmount > sipPrefillAmount) {
				amount = schemeData?.minSipAmount?.toFixed(0);
			} else {
				amount = sipPrefillAmount?.toFixed(0);
			}
		} else if (activeTab === 'ONETIME') {
			if (
				redirectedFrom !== 'INVESTMENT_DETAILS' &&
				!fromInvestmentDetailsPage &&
				schemeData?.minLumpsumAmount > lumpsumPrefillAmount
			) {
				amount = schemeData?.minLumpsumAmount?.toFixed(0);
			} else if (
				(redirectedFrom === 'INVESTMENT_DETAILS' || fromInvestmentDetailsPage) &&
				schemeData?.additionalPurchaseAmount > lumpsumPrefillAmount
			) {
				amount = schemeData?.additionalPurchaseAmount?.toFixed(0);
			} else {
				amount = lumpsumPrefillAmount?.toFixed(0);
			}
		}
	};

	prefillAmount();
	prefillParamsData();

	const switchTabs = (val: string) => {
		if (val !== activeTab) {
			amount = '';
			activeTab = val;

			prefillAmount();
			setErrorMessage();
			handleShowTabNotSupported();
			handleAmountInputFocus();
		}
	};

	const handleInvestClick = () => {
		// add logic
	};

	const toggleTncModal = () => {
		showTncModal = !showTncModal;
	};

	onMount(() => {
		handleShowTabNotSupported();

		if (isMobile) {
			handleAmountInputFocus();

			$headerStore.showMobileHeader = false;
		}
	});

	onDestroy(() => {
		if (isMobile) {
			$headerStore.showMobileHeader = true;
		}
	});

	const toggleCalendar = () => {
		showCalendar = !showCalendar;

		tempCalendarDate = calendarDate;
		tempCalendarMonth = calendarMonth;
		tempCalendarYear = calendarYear;
		dateSuperscript = getDateSuperscript(tempCalendarDate);

		if (!showCalendar) {
			handleAmountInputFocus();
		}
	};

	const handleDateSelect = (value: unknown) => {
		tempCalendarDate = value?.detail;

		const now = new Date();
		const month = getSIPMonthBasedOnDate(tempCalendarDate, now, firstSipPayment ? 30 : 10);
		tempCalendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});

		tempCalendarYear = getSIPYearBasedOnDate(tempCalendarDate, now, firstSipPayment ? 30 : 10);
	};

	const handleDateChange = (value: unknown) => {
		calendarDate = value?.detail;
		dateSuperscript = getDateSuperscript(calendarDate);

		setNextSipDate();
		toggleCalendar();
	};
</script>

<section class={`h-fit w-full rounded-lg bg-grey shadow-csm ${$$props?.class}`}>
	<slot name="header">
		<section class="hidden rounded-t-lg bg-white px-3 py-5 font-medium text-black-title md:block">
			Your Investment Pad
		</section>
	</slot>
	{#if isMobile && !$headerStore?.showMobileHeader}
		<slot name="customMobileHeader">
			<MobileHeader
				title={schemeData?.schemeName}
				showSearchIcon={false}
				showBackIcon={true}
				showCloseIcon={false}
				class="-mx-2 -mt-2 mb-2 bg-white"
			/>
		</slot>
	{/if}
	<article class="mb-4 rounded-lg bg-white text-black-title md:mx-3 md:mt-2">
		<!-- Tab Section (SIP | ONE TIME) -->
		<section class="bg-whites flex rounded-lg rounded-b-none text-black-title">
			<button
				class={`h-12 w-40 flex-1 cursor-default rounded-t md:cursor-pointer ${
					activeTab === 'SIP'
						? 'border-t-4 border-t-green-buy'
						: 'rounded-tr-none border-t border-l bg-grey'
				}`}
				on:click={() => switchTabs('SIP')}
			>
				SIP
			</button>
			<button
				class={`h-12 w-40 flex-1 cursor-default rounded-t md:cursor-pointer ${
					activeTab === 'ONETIME'
						? 'border-t-4 border-t-green-buy'
						: 'rounded-tl-none border-t border-r bg-grey'
				}`}
				on:click={() => switchTabs('ONETIME')}
			>
				ONE TIME
			</button>
		</section>

		<article class="flex">
			<!-- Amount input -->
			<article
				class={`flex flex-col items-start p-2 ${activeTab === 'SIP' ? 'w-7/12' : 'w-full pb-3'}`}
			>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="mb-2 text-xs font-normal text-black-title">Amount</label>
				<button
					class="flex w-full cursor-text items-center justify-start rounded border border-gray-200 px-3 py-2"
					on:click={handleAmountInputFocus}
				>
					<input
						id="amountInput"
						inputmode="none"
						maxlength="13"
						placeholder="₹"
						value={amountVal}
						class="w-full bg-white text-base font-medium leading-none text-black-title outline-none"
						on:input={onInputChange}
					/>
				</button>
			</article>

			<!-- Date (Calendar) input -->
			{#if activeTab === 'SIP'}
				<article class="flex w-5/12 flex-col items-start p-2">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="mb-2 text-xs font-normal text-black-title">Monthly SIP Date</label>
					<!-- TODO: add calendar date selection functionality -->
					<section
						class="flex items-center justify-between rounded border border-gray-200 md:cursor-pointer"
						on:click={toggleCalendar}
						on:keypress={() => {
							// add logic
						}}
					>
						<input
							id="dateSelector"
							inputmode="numeric"
							value={`${calendarDate}${dateSuperscript}`}
							readonly
							class="w-3/4 rounded bg-white px-3 py-2 text-base font-medium leading-none text-black-title outline-none md:cursor-pointer"
						/>
						<section class="border-l p-2.5">
							<CalendarSmallIcon />
						</section>
					</section>
				</article>
			{/if}
		</article>

		{#if errorMessage?.length}
			<article class="flex justify-center pb-1">
				<p class="text-xs font-light text-red-sell">
					{errorMessage}
				</p>
			</article>
		{/if}

		<!-- Checkbox for SIP payment now -->
		{#if activeTab === 'SIP'}
			<article
				class={`flex w-fit items-center justify-start pl-1 pt-2 pb-3 text-xs font-medium text-grey-body ${'md:cursor-pointer'}`}
				on:click={toggleFirstSipPayment}
				on:keypress={() => {
					// add logic
				}}
			>
				{#if firstSipPayment}
					<div class="ml-1 mr-2">
						<CheckboxCheckedIcon />
					</div>
				{:else}
					<div class="mr-1">
						<CheckboxUncheckedIcon />
					</div>
				{/if}
				<span class="text-black-neutral md:text-black-title"> Make first SIP payment now </span>
			</article>
		{/if}

		{#if showTabNotSupported}
			<div class="pb-1">
				<TabNotSupported {tabNotSupportedType} />
			</div>
		{/if}
	</article>

	<!-- Footer section for Mobile layout (PaymentMode/StartSipDate + TnC + Submit + Numpad) -->
	<article class="mx-3 md:mx-0">
		<section class="fixed inset-0 top-auto md:relative md:inset-auto">
			{#if activeTab === 'SIP' && !firstSipPayment}
				<NextSipDate {calendarDate} {calendarMonth} {calendarYear} />
			{/if}

			<article class="rounded-b-lg bg-white px-4 pt-3 md:px-3">
				<!-- TnC Section -->
				<article class="flex items-center justify-center">
					<p class="text-center text-xs font-normal text-black-title">
						By proceeding, you accept Angel One's
						<button class="text-blue-primary md:cursor-pointer" on:click={toggleTncModal}>
							Terms and Conditions
						</button>
					</p>
				</article>

				<!-- Submit Button -->
				<Button
					class={`bottom-0 my-3 h-12 w-full rounded ${
						!amount?.length || !!errorMessage?.length || showTabNotSupported
							? 'cursor-default !bg-grey-line !text-grey-disabled active:opacity-100'
							: 'bg-blue-primary'
					}`}
					disabled={!amount?.length || !!errorMessage?.length || showTabNotSupported}
					onClick={handleInvestClick}
				>
					{activeTab === 'SIP' ? 'START SIP' : 'PAY NOW'}
				</Button>
			</article>

			<!-- On-screen numpad keyboard for Mobile layout -->
			<NumPad
				class="block md:hidden"
				maxNumberLimit={maximumAmountLimit}
				bind:number={amount}
				on:numpadKeyCick={handleAmountInputFocus}
			/>
		</section>
	</article>

	{#if showCalendar}
		<Modal isModalOpen={showCalendar} on:backdropclicked={toggleCalendar}>
			<CalendarComponent
				visible={showCalendar}
				title={'Select SIP Instalment Date'}
				heading={'CONFIRM'}
				showClose={true}
				showSubmit={true}
				{dateArray}
				defaultValue={calendarDate}
				on:submit={handleDateChange}
				on:dateSelect={handleDateSelect}
				on:close={toggleCalendar}
				class="z-60 sm:w-120"
			>
				<svelte:fragment slot="dateSlot">
					<NextSipDate
						calendarDate={tempCalendarDate}
						calendarMonth={tempCalendarMonth}
						calendarYear={tempCalendarYear}
					/>
				</svelte:fragment>

				<svelte:fragment slot="footer">
					<section class="hidden flex-row justify-center rounded-b-lg bg-gray-50 py-4 px-8 md:flex">
						<p class="text-center text-sm font-light text-grey-body">
							It is the day on which the amount payable towards your SIP order becomes due. The day
							on which SIP instalments are paid is called SIP day.
						</p>
					</section>
				</svelte:fragment>
			</CalendarComponent>
		</Modal>
	{/if}

	{#if showTncModal}
		<!-- T&C Modal -->
		<TncModal showModal={showTncModal} on:closeModal={toggleTncModal} />
	{/if}
</section>
