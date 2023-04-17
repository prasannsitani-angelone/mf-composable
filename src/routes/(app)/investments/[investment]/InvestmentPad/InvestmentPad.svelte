<script lang="ts">
	import Button from '$components/Button.svelte';
	import NumPad from '$components/Keyboard/NumPad.svelte';
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import CheckboxCheckedIcon from '$lib/images/icons/CheckboxCheckedIcon.svelte';
	import CheckboxUncheckedIcon from '$lib/images/icons/CheckboxUncheckedIcon.svelte';
	// import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { onMount } from 'svelte';

	// eslint-disable-next-line
	// export let schemeData: SchemeDetails;

	let maximumAmountLimit = 999999999;

	// eslint-disable-next-line
	let amount = '';
	$: amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	$: activeTab = 'SIP';
	$: calendarDate = 4;
	$: dateSuperscript = 'th';
	$: errorMessage = '';
	$: firstSipPayment = true;

	const toggleFirstSipPayment = () => {
		firstSipPayment = !firstSipPayment;
		setNextSipDate();
	};

	const setErrorMessage = () => {
		if (!amount?.length) {
			errorMessage = 'Amount should be more than 0';
		} else {
			errorMessage = '';
		}

		// if (activeTab?.value === 'SIP') {
		// 	if (parseInt(amount.value) < props?.schemeDetails?.minSipAmount) {
		// 		errorMessage.value = 'Min SIP Amount: ₹' + (addCommasToAmountString((props?.schemeDetails?.minSipAmount)?.toString()) || props?.schemeDetails?.minSipAmount)
		// 	} else if (parseInt(amount.value) > props?.schemeDetails?.sipMaxAmount) {
		// 		errorMessage.value = 'Max SIP Amount: ₹' + (addCommasToAmountString((props?.schemeDetails?.sipMaxAmount)?.toString()) || props?.schemeDetails?.sipMaxAmount)
		// 	} else if (parseInt(parseInt(amount.value) % props?.schemeDetails?.sipMultiplierAmount)) {
		// 		errorMessage.value = `Please invest in multiples of ₹${props?.schemeDetails?.sipMultiplierAmount}`
		// 	} else {
		// 		errorMessage.value = ''
		// 	}
		// } else if (activeTab?.value === 'ONETIME') {
		// 	if ((redirectedFrom !== 'INVESTMENT_DETAILS' && !props?.fromInvestmentDetailsPage) && (parseInt(amount.value) < props?.schemeDetails?.minLumpsumAmount)) {
		// 		errorMessage.value = 'Min Investment Amount: ₹' + (addCommasToAmountString((props?.schemeDetails?.minLumpsumAmount)?.toString()) || props?.schemeDetails?.minLumpsumAmount)
		// 	} else if ((redirectedFrom === 'INVESTMENT_DETAILS' || props?.fromInvestmentDetailsPage) && (parseInt(amount.value) < props?.schemeDetails?.additionalPurchaseAmount)) {
		// 		errorMessage.value = 'Min Investment Amount: ₹' + (addCommasToAmountString((props?.schemeDetails?.additionalPurchaseAmount)?.toString()) || props?.schemeDetails?.additionalPurchaseAmount)
		// 	} else if (props?.schemeDetails?.lumpsumMaxAmount > 0 && parseInt(amount.value) > props?.schemeDetails?.lumpsumMaxAmount) {
		// 		errorMessage.value = 'Max Investment Amount: ₹' + (addCommasToAmountString((props?.schemeDetails?.lumpsumMaxAmount)?.toString()) || props?.schemeDetails?.lumpsumMaxAmount)
		// 	} else if (parseInt(parseInt(amount.value) % props?.schemeDetails?.lumpsumMultiplierAmount)) {
		// 		errorMessage.value = `Please invest in multiples of ₹${props?.schemeDetails?.lumpsumMultiplierAmount}`
		// 	} else {
		// 		errorMessage.value = ''
		// 	}
		// }
	};

	const handleShowTabNotSupported = () => {
		// if (activeTab?.value === 'SIP') {
		// 	showTabNotSupported.value = props?.schemeDetails?.isSipAllowed !== 'Y'
		// 	tabNotSupportedType.value = 'SIP'
		// } else if (activeTab?.value === 'ONETIME') {
		// 	showTabNotSupported.value = props?.schemeDetails?.isLumpsumAllowed !== 'Y'
		// 	tabNotSupportedType.value = 'One time'
		// }
	};

	const setDefaultSipDate = () => {
		// let areAllDaysAllowed = true
		// for (let i = 1; i <= 28; i++) {
		// 	if (parseInt(sipAllowedDaysArray?.value[i - 1]) !== i) {
		// 		areAllDaysAllowed = false
		// 	}
		// }
		// if (areAllDaysAllowed) {
		// 	calendarDate.value = 4
		// } else if (sipAllowedDaysArray?.value?.length) {
		// 	calendarDate.value = parseInt(sipAllowedDaysArray?.value[0])
		// } else {
		// 	calendarDate.value = 1
		// }
		// dateSuperscript.value = getDateSuperscript(calendarDate.value)
	};

	setDefaultSipDate();

	const setNextSipDate = () => {
		// const now = new Date()
		// const month = getSIPMonthBasedOnDate(calendarDate?.value, now, firstSipPayment?.value ? 30 : 10)
		// calendarMonth.value = new Date(now?.getFullYear(), month, 0)
		// 	?.toLocaleString('default', { month: 'short' })
		// calendarYear.value = getSIPYearBasedOnDate(calendarDate?.value, now, firstSipPayment?.value ? 30 : 10)
	};

	setNextSipDate();

	const onInputChange = () => {
		// TODO: pass amount: string in this function
		// let formattedValue = e.target.value
		// inputValue.value = formattedValue
		// formattedValue = formatAmount(formattedValue) // trim, remove alphabets and remove leading zeroes
		// inputValue.value = addCommasToAmountString(formattedValue) // get amount string with commas in INR currency format
		// if (inputValue?.value?.length >= 1) {
		// 	inputValue.value = '₹' + inputValue?.value
		// }
		// amount.value = formattedValue
		// updatePaymentMode()
		// setErrorMessage()
	};

	$: onInputChange(amount);

	const prefillParamsData = () => {
		// if (investmentType) {
		// 	activeTab.value = investmentType === 'LUMPSUM' ? 'ONETIME' : 'SIP'
		// }
		// if (investmentAmount) {
		// 	inputValue.value = `₹${addCommasToAmountString(parseInt(investmentAmount)?.toFixed(0))}`
		// 	amount.value = parseInt(investmentAmount)?.toFixed(0)
		// 	setErrorMessage()
		// }
		// if (typeof ftp === 'boolean') {
		// 	firstSipPayment.value = ftp
		// }
		// if (sipDate) {
		// 	calendarDate.value = sipDate
		// 	dateSuperscript.value = getDateSuperscript(sipDate)
		// 	setNextSipDate()
		// }
		// if (skipOrderPad && (ftp || activeTab.value === 'ONETIME')) {
		// 	showChangePaymentModeSection.value = ff.value === 'lf'
		// 	showChangePaymentModeModal.value = ff.value === 'mf'
		// }
	};

	prefillParamsData();

	const prefillAmount = (tab: string) => {
		if (tab === 'ONETIME') {
			amount = '5000';
		} else {
			amount = '1000';
		}

		// if (activeTab?.value === 'SIP') {
		// 	if (props?.schemeDetails?.minSipAmount > sipPrefillAmount) {
		// 		inputValue.value = `₹${addCommasToAmountString(props?.schemeDetails?.minSipAmount?.toFixed(0))}`
		// 		amount.value = props?.schemeDetails?.minSipAmount?.toFixed(0)
		// 	} else {
		// 		inputValue.value = `₹${addCommasToAmountString(sipPrefillAmount?.toFixed(0))}`
		// 		amount.value = sipPrefillAmount?.toFixed(0)
		// 	}
		// } else if (activeTab?.value === 'ONETIME') {
		// 	if ((redirectedFrom !== 'INVESTMENT_DETAILS' && !props?.fromInvestmentDetailsPage) && (props?.schemeDetails?.minLumpsumAmount > lumpsumPrefillAmount)) {
		// 		inputValue.value = `₹${addCommasToAmountString(props?.schemeDetails?.minLumpsumAmount?.toFixed(0))}`
		// 		amount.value = props?.schemeDetails?.minLumpsumAmount?.toFixed(0)
		// 	} else if ((redirectedFrom === 'INVESTMENT_DETAILS' || props?.fromInvestmentDetailsPage) && (props?.schemeDetails?.additionalPurchaseAmount > lumpsumPrefillAmount)) {
		// 		inputValue.value = `₹${addCommasToAmountString(props?.schemeDetails?.additionalPurchaseAmount?.toFixed(0))}`
		// 		amount.value = props?.schemeDetails?.additionalPurchaseAmount?.toFixed(0)
		// 	} else {
		// 		inputValue.value = `₹${addCommasToAmountString(lumpsumPrefillAmount?.toFixed(0))}`
		// 		amount.value = lumpsumPrefillAmount?.toFixed(0)
		// 	}
		// }
	};

	prefillAmount(activeTab);

	const switchTabs = (val: string) => {
		if (val !== activeTab) {
			amount = '';
			activeTab = val;

			prefillAmount(val);
			setErrorMessage();
			handleShowTabNotSupported();
		}
	};

	const handleInvestClick = () => {
		// add logic
	};

	const toggleTncModal = () => {
		// showTncModal.value = !showTncModal?.value
	};

	onMount(() => {
		handleShowTabNotSupported();
	});
</script>

<article class="rounded-lg bg-white text-black-title">
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
			<section
				class="flex w-full cursor-text items-center justify-start rounded border border-gray-200 px-3 py-2"
			>
				<input
					id="amountInput"
					inputmode="numeric"
					maxlength="13"
					placeholder="₹"
					value={amountVal}
					class="w-full bg-white text-base font-medium leading-none text-black-title outline-none"
					readOnly
				/>
			</section>
		</article>

		<!-- Date (Calendar) input -->
		{#if activeTab === 'SIP'}
			<article class="flex w-5/12 flex-col items-start p-2">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="mb-2 text-xs font-normal text-black-title">Monthly SIP Date</label>
				<!-- TODO: add calendar date selection functionality -->
				<section
					class="flex items-center justify-between rounded border border-gray-200 md:cursor-pointer"
					on:click={() => {
						// add logic
					}}
					on:keypress={() => {
						// add logic
					}}
				>
					<input
						id="amountInput"
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

	<!-- Footer section for Mobile layout (PaymentMode/StartSipDate + TnC + Submit + Numpad) -->
	<article class="mx-3 mt-4 block md:block">
		<section class="fixed inset-0 top-auto">
			<article class="bg-white px-4 pt-3">
				<!-- TnC Section -->
				<article class="flex items-center justify-center">
					<p class="text-center text-xs font-normal text-black-title">
						By proceeding, you accept Angel One's
						<span
							class="text-blue-primary md:cursor-pointer"
							on:click={toggleTncModal}
							on:keypress={() => {
								// add logic
							}}
						>
							Terms and Conditions
						</span>
					</p>
				</article>

				<!-- Submit Button -->
				<!-- TODO: add class logic for showTabNotSupported also -->
				<!-- TODO: add disabled logic for logInState, profileStore isError, showTabNotSupported as well -->
				<Button
					class={`bottom-0 my-3 h-12 w-full rounded ${
						!amount?.length || !!errorMessage?.length
							? 'cursor-default bg-grey-line text-grey-disabled active:opacity-100'
							: 'bg-blue-primary'
					}`}
					disabled={!amount?.length || !!errorMessage?.length}
					onClick={handleInvestClick}
				>
					{activeTab === 'SIP' ? 'START SIP' : 'PAY NOW'}
				</Button>
			</article>

			<NumPad bind:number={amount} maxNumberLimit={maximumAmountLimit} />
		</section>
	</article>
</article>
