<script lang="ts">
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import {
		getDateSuperscript,
		getSIPYearBasedOnDate,
		getSIPMonthBasedOnDate,
		getCompleteSIPDateBasedonDD
	} from '$lib/utils/helpers/date';
	import { addCommasToAmountString, formatAmount } from '$lib/utils/helpers/formatAmount';
	import { useFetch } from '$lib/utils/useFetch';
	import { onMount } from 'svelte';
	import { debounce } from '$lib/utils/helpers/debounce';
	import NumPad from '$components/Keyboard/NumPad.svelte';
	import Button from '$components/Button.svelte';
	import Modal from '$components/Modal.svelte';
	import CalendarComponent from '$components/Calendar/CalendarComponent.svelte';
	import type { dateArrayTypes } from '$lib/types/Calendar/ICalendar';
	import NextSipDate from '$components/Calendar/NextSipDate.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import { format } from 'date-fns';
	import { stringToFloat } from 'svelte-components';
	import LoadingPopup from '$components/Payment/LoadingPopup.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import {
		editSipDoneAnalytics,
		editSipScreenImpressionAnalytics,
		editSipUpdateClickAnalytics,
		editSipConfirmImpressionAnalytics,
		editSipConfirmClickAnalytics,
		editSipConfirmScreenAnalytics
	} from '$lib/analytics/sipbook/sipbook';
	import { page } from '$app/stores';
	import { decodeToObject } from '$lib/utils/helpers/params';
	import { profileStore } from '$lib/stores/ProfileStore';
	import Physical2FAOtpVerificationComponent from '$components/Payment/Physical2FAOtpVerificationComponent.svelte';

	let editSipShowModal: () => void = () => undefined;
	let nextSipDueDate: number;
	let installmentAmount: number;
	let logoUrl: string;
	let schemeName: string;
	let isin: string;
	let schemeCode: string;
	let isMobile: boolean;
	let isTablet: boolean;
	let sipId: string;
	export {
		editSipShowModal,
		nextSipDueDate,
		installmentAmount,
		logoUrl,
		isin,
		schemeCode,
		schemeName,
		isMobile,
		isTablet,
		sipId
	};

	let showCalendar = false;
	let calendarDate = new Date(nextSipDueDate)?.getDate();
	let calendarMonth = new Date(nextSipDueDate)?.toLocaleString('default', { month: 'short' });
	let calendarYear = new Date(nextSipDueDate)?.getFullYear();
	let tempCalendarDate = calendarDate;
	let tempCalendarMonth = calendarMonth;
	let tempCalendarYear = calendarYear;
	let dateSuperscript = getDateSuperscript(calendarDate);
	let amount = installmentAmount.toFixed(0);
	let schemeData: SchemeDetails;
	let errorMessage = '';
	let newSipId = sipId;
	const maximumAmountLimit = 999999999;
	let dateArray: Array<dateArrayTypes> = [{ value: 1, disabled: false }];
	let showConfirmationPopup = false;
	let editSuccess = false;
	let editFailure = false;
	let isLoading = false;
	let editFailureMsg = '';
	$: amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	$: onInputChange(amount);

	let showOtpVerificationModal = false;
	let isOtpVerificationDone = false;

	const params = $page.url.searchParams.get('params') || '';
	const {
		isExternal = false,
		sipAmount = '',
		sipStartDate = '',
		requestId = ''
	} = decodeToObject(params || '');

	const uuid = uuidv4();
	const navigateToSipDashboardUrl = async () => {
		editSipDoneAnalytics();
		goto(`${base}/sipbook/dashboard`);
		editSuccess = false;
	};
	const getSchemeData = async (isin: string, schemeCode: string): Promise<SchemeDetails> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		const res = await useFetch(
			url,
			{
				headers: {
					'X-LRU': 'true'
				}
			},
			fetch
		);

		if (res.ok) {
			schemeData = res?.data;
		}
		return schemeData;
	};
	onMount(async () => {
		if (isExternal) {
			amount = sipAmount;
			calendarDate = new Date(sipStartDate)?.getDate();
			calendarMonth = new Date(sipStartDate)?.toLocaleString('default', { month: 'short' });
			calendarYear = new Date(sipStartDate)?.getFullYear();
		}
		await getSchemeData(isin, schemeCode);
		if (isMobile || isTablet) {
			handleAmountInputFocus();
		}
		let sipAllowedDaysArray = schemeData?.sipAllowedDays?.length
			? schemeData?.sipAllowedDays?.trim()?.split(',') || []
			: [];
		dateArray.pop();

		for (let i = 1; i <= 28; i++) {
			dateArray.push({
				value: i,
				disabled: (sipAllowedDaysArray || []).findIndex((d: string) => parseInt(d) === i) === -1
			});
		}
		let sipDate = new Date(nextSipDueDate)?.getDate();
		editSipScreenImpressionAnalytics({
			fundName: schemeName,
			amount: installmentAmount,
			sipDate: `${sipDate}${getDateSuperscript(sipDate)} of every month`
		});
	});

	const resetAmountVal = () => {
		amountVal = '0';
		amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	};
	const setErrorMessage = () => {
		if (!amount?.length || !Number(amount)) {
			errorMessage = 'Amount should be more than 0';
			return;
		}
		if (parseInt(amount) < schemeData?.minSipAmount) {
			errorMessage =
				'Min SIP Amount: ₹' +
				(addCommasToAmountString(schemeData?.minSipAmount?.toString()) || schemeData?.minSipAmount);
		} else if (parseInt(amount) > schemeData?.sipMaxAmount) {
			errorMessage =
				'Max SIP Amount: ₹' +
				(addCommasToAmountString(schemeData?.sipMaxAmount?.toString()) || schemeData?.sipMaxAmount);
		} else if (parseInt(amount) % schemeData?.sipMultiplierAmount) {
			errorMessage = `Please invest in multiples of ₹${schemeData?.sipMultiplierAmount}`;
		} else {
			errorMessage = '';
		}
	};
	const onInputChange = (val: string | object) => {
		let inputValue = val.toString();
		if (isMobile || isTablet) {
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
	const handleAmountInputFocus = () => {
		const amountInputElement = document?.getElementById('amountInput');
		amountInputElement?.focus();
	};
	const removeAmountInputFocus = () => {
		const amountInputElement = document?.getElementById('amountInput');
		amountInputElement?.blur();
	};
	const handleAmountInputBlur = () => {
		if (isMobile || isTablet) {
			const debouncedRemoveAmountInputFocus = debounce(removeAmountInputFocus, 250);
			debouncedRemoveAmountInputFocus();
		}
	};
	const handleDateChange = (value: unknown) => {
		calendarDate = value?.detail;
		dateSuperscript = getDateSuperscript(calendarDate);

		setNextSipDate();
		toggleCalendar();
	};
	const setNextSipDate = () => {
		const now = new Date();
		const month = getSIPMonthBasedOnDate(calendarDate, now, 10);
		calendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});
		calendarYear = getSIPYearBasedOnDate(calendarDate, now, 10);
	};
	const handleDateSelect = (value: unknown) => {
		tempCalendarDate = value?.detail;

		const now = new Date();
		const month = getSIPMonthBasedOnDate(tempCalendarDate, now, 10);
		tempCalendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});

		tempCalendarYear = getSIPYearBasedOnDate(tempCalendarDate, now, 10);
	};
	const getSIPDate = () => {
		return getCompleteSIPDateBasedonDD(calendarDate, new Date(), 10);
	};

	const getFormattedSIPDate = () => {
		return format(getSIPDate(), 'yyyy-MM-dd');
	};
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
	const onToggleConfirmation = () => {
		showConfirmationPopup = !showConfirmationPopup;
		if (showConfirmationPopup) {
			editSipUpdateClickAnalytics({
				fundName: schemeName,
				updatedAmount: stringToFloat(amount),
				updatedSipDate: `${calendarDate}${dateSuperscript} of every month`
			});
			editSipConfirmImpressionAnalytics({
				fundName: schemeName,
				updatedAmount: stringToFloat(amount),
				amount: installmentAmount
			});
		}
	};
	const onFinalConfirm = async () => {
		if (profileStore.accountType() === 'P' && !isOtpVerificationDone) {
			showOtpVerificationModal = true;
			return;
		}

		editSipConfirmClickAnalytics({
			fundName: schemeName,
			updatedAmount: stringToFloat(amount),
			amount: installmentAmount
		});
		const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/${sipId}`;
		isLoading = true;
		const response = await useFetch(url, {
			method: 'PATCH',
			headers: {
				'X-Request-Id': isExternal && requestId ? requestId : uuid
			},
			body: JSON.stringify({
				amount: stringToFloat(amount),
				action: 'MODIFY_SIP',
				startDate: getFormattedSIPDate()
			})
		});
		isLoading = false;
		if (response.ok && response?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			editSuccess = true;
			newSipId = response?.data?.data?.newSipId;
			editSipConfirmScreenAnalytics({
				fundName: schemeName,
				updatedAmount: stringToFloat(amount),
				amount: installmentAmount,
				updatedSipDate: `${calendarDate}${dateSuperscript} ${getSIPDate().toLocaleString(
					'default',
					{ month: 'short' }
				)}}`
			});
		} else {
			editFailure = true;
			editFailureMsg =
				response?.data?.errorCode === 'MF-SVC-SIPS-40'
					? response?.data?.message
					: 'We could not edit your SIP due to a technical error. Please try again';
		}
	};
</script>

<div
	class="h-screen w-full origin-top border bg-background pb-4 transition duration-100 md:h-fit md:rounded-md md:lg:overflow-hidden"
>
	<header class="z-[70] flex-shrink-0 bg-background-alt">
		<section
			class="flex items-center justify-start bg-background-alt px-3 py-4 text-center shadow-csm"
		>
			<LeftArrowIcon class="md:hidden" onClick={editSipShowModal} />
			<h1 class="ml-4 text-lg font-normal text-title">
				<div class="w-80 truncate text-left">Edit SIP</div>
			</h1>
		</section>
	</header>
	{#if isMobile || isTablet}
		<div
			class="mx-2 mt-3 origin-top rounded-md bg-background-alt px-3 py-3 transition duration-100"
		>
			<div class="flex flex-row justify-between p-2">
				<div class="flex flex-row items-center">
					<SchemeLogo size="xs" src={logoUrl} alt="schemelogo" />
					<div class="mr-3 text-sm font-normal text-title">{schemeName}</div>
				</div>
			</div>
		</div>
	{/if}
	<div class="mx-2 mt-3 origin-top rounded-md bg-background-alt px-3 py-3 transition duration-100">
		<article class="flex flex-col items-center rounded border py-2.5">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="mb-2 text-xs font-normal text-body">ENTER AMOUNT</label>
			<button
				class="flex w-full cursor-text items-center justify-start"
				on:click={handleAmountInputFocus}
			>
				<input
					id="amountInput"
					inputmode="none"
					maxlength="13"
					placeholder="₹"
					value={amountVal}
					class="w-full bg-background-alt text-center text-2xl font-medium leading-none text-title outline-none"
					on:input={onInputChange}
					on:focus={handleAmountInputBlur}
				/>
			</button>
		</article>
		{#if errorMessage?.length}
			<article class="flex justify-center pb-1">
				<p class="text-xs font-light text-sell">
					{errorMessage}
				</p>
			</article>
		{/if}
		<article class="mt-3 flex w-full flex-row items-center justify-between">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="text-xs font-normal text-title">Monthly SIP Date</label>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<section class="flex items-center md:cursor-pointer" on:click={toggleCalendar}>
				<div class="text-xs font-normal text-title">
					{`${calendarDate}${dateSuperscript}`}
				</div>
				<section class="pl-1">
					<CalendarSmallIcon height={16} width={16} />
				</section>
			</section>
		</article>
		<article class="mx-3 md:mx-0">
			<section class="fixed inset-0 top-auto md:hidden">
				<!-- Submit Button -->
				<div class="flex flex-1 bg-background-alt">
					<Button
						class={`m-3 flex h-12 flex-1 rounded ${
							!amount?.length ||
							!!errorMessage?.length ||
							(stringToFloat(amount) === installmentAmount &&
								calendarDate === new Date(nextSipDueDate)?.getDate())
								? 'cursor-default !bg-border !text-disabled active:opacity-100'
								: 'bg-primary'
						}`}
						disabled={!amount?.length ||
							!!errorMessage?.length ||
							(stringToFloat(amount) === installmentAmount &&
								calendarDate === new Date(nextSipDueDate)?.getDate())}
						onClick={() => onToggleConfirmation()}
						>UPDATE
					</Button>
				</div>
				<NumPad
					class="block md:hidden"
					maxNumberLimit={maximumAmountLimit}
					bind:number={amount}
					on:numpadKeyCick={handleAmountInputFocus}
				/>
			</section>
		</article>
		<section class="fixed inset-0 top-auto hidden md:relative md:inset-auto md:block">
			<!-- Submit Button -->
			<div class="flex flex-1 bg-background-alt">
				<Button
					class={`my-3 flex h-12 flex-1 rounded ${
						!amount?.length ||
						!!errorMessage?.length ||
						(stringToFloat(amount) === installmentAmount &&
							calendarDate === new Date(nextSipDueDate)?.getDate())
							? 'cursor-default !bg-border !text-disabled active:opacity-100'
							: 'bg-primary'
					}`}
					disabled={!amount?.length ||
						!!errorMessage?.length ||
						(stringToFloat(amount) === installmentAmount &&
							calendarDate === new Date(nextSipDueDate)?.getDate())}
					onClick={() => onToggleConfirmation()}
					>UPDATE
				</Button>
			</div>
		</section>
		<article>
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
							>
								<svelte:fragment slot="content">
									<span class="font-normal text-body">Next SIP payment will be on</span>
								</svelte:fragment>
							</NextSipDate>
						</svelte:fragment>

						<svelte:fragment slot="footer">
							<section
								class="hidden flex-row justify-center rounded-b-lg bg-gray-50 px-8 py-4 md:flex"
							>
								<p class="text-center text-sm font-light text-body">
									It is the day on which the amount payable towards your SIP order becomes due. The
									day on which SIP instalments are paid is called SIP day.
								</p>
							</section>
						</svelte:fragment>
					</CalendarComponent>
				</Modal>
			{/if}
		</article>
		<Modal
			isModalOpen={showConfirmationPopup}
			closeModal={onToggleConfirmation}
			class="bg-background-alt"
		>
			<div
				class="flex w-full flex-col overflow-y-auto rounded-b-none rounded-t-2xl bg-background-alt pt-2 text-sm shadow-clg sm:w-120 sm:rounded-lg md:rounded-lg md:p-4"
			>
				<p class="px-4 pb-4 pt-4 text-base font-medium text-title">Confirm SIP Changes</p>
				<div class="flex justify-between px-4 pb-2 pt-4">
					<div class="text-body">Updated Instalment Amount</div>
					<div class="font-medium text-title">
						{amountVal}
					</div>
				</div>
				<div class="flex justify-between p-4">
					<div class="text-body">Updated SIP Date</div>
					<div class="font-medium text-title">
						{calendarDate}{dateSuperscript} of every month
					</div>
				</div>
				<div class="flex justify-between px-4 pb-4">
					<Button class="mt-3 flex h-12 flex-1 rounded bg-primary" onClick={() => onFinalConfirm()}
						>CONFIRM
					</Button>
				</div>
			</div>
		</Modal>
		<ResultPopup
			closeModal={navigateToSipDashboardUrl}
			isModalOpen={editSuccess}
			popupType={STATUS_ARR.SUCCESS}
			buttonTitle="DONE"
			class="w-full rounded-b-none rounded-t-2xl p-4 pb-9 sm:px-8 sm:py-8 md:rounded-lg"
			buttonClass="mt-8 w-full rounded !bg-primary !text-background-alt cursor-default md:cursor-pointer"
			handleButtonClick={() => {
				navigateToSipDashboardUrl();
			}}
		>
			<svelte:fragment slot="popupBody">
				<div class="pt-4 text-lg font-medium text-title">SIP Updated</div>
				<article class="border-gray-line mt-4 w-full rounded-md border text-center">
					<div class="flex flex-row items-center p-3">
						<SchemeLogo size="xs" src={logoUrl} alt="schemelogo" />
						<div class="mr-3 text-left text-sm font-normal text-title">{schemeName}</div>
					</div>
					<div class="flex flex-col bg-background p-2 text-sm">
						<div class="flex items-center justify-between px-2 pt-2">
							<div class="text-body">Instalment Amount</div>
							<div class="text-base font-medium text-title">
								{amountVal}
							</div>
						</div>
						<div class="flex items-center justify-between p-2">
							<div class="text-body">Next SIP Payment</div>
							<div class="text-base font-medium text-title">
								{getSIPDate().getDate()}
								{getSIPDate().toLocaleString('default', { month: 'short' })}
								{getSIPDate().getFullYear()}
							</div>
						</div>
					</div>
				</article>
			</svelte:fragment>
		</ResultPopup>
		<ResultPopup
			closeModal={() => {
				editFailure = false;
				showConfirmationPopup = false;
			}}
			isModalOpen={editFailure}
			popupType={STATUS_ARR.FAILURE}
			title="Error"
			text={editFailureMsg}
			buttonTitle="RETRY"
			class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-8 sm:py-8 md:rounded-lg"
			buttonClass="mt-8 w-40 border border-primary rounded !bg-background-alt !text-primary cursor-default md:cursor-pointer"
			handleButtonClick={() => {
				editFailure = false;
				showConfirmationPopup = false;
			}}
		/>
		{#if isLoading}
			<LoadingPopup />
		{/if}

		<!-- 2FA (OTP) Verification Process -->
		{#if showOtpVerificationModal}
			<Physical2FAOtpVerificationComponent
				uuid={isExternal && requestId ? requestId : uuid}
				amount={amount.toString()}
				investmentType="Portfolio"
				{schemeName}
				on:otpVerificationSuccessful={() => {
					showOtpVerificationModal = false;
					isOtpVerificationDone = true;
					onFinalConfirm();
				}}
				on:closeOtpModal={() => {
					showOtpVerificationModal = false;
				}}
			/>
		{/if}
	</div>
</div>
