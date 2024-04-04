<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import CalendarComponent from '$components/Calendar/CalendarComponent.svelte';
	import Modal from '$components/Modal.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import type { dateArrayTypes, instalmentDate } from '$lib/types/Calendar/ICalendar';
	import {
		getDateSuperscript,
		getInstalmentDateDetailsFtp,
		getSIPMonthBasedOnDate,
		getSIPYearBasedOnDate
	} from '$lib/utils/helpers/date';
	import type { CartEntity } from '$lib/types/ICartStore';
	import InstalmentDates from '$components/Calendar/InstalmentDates.svelte';

	export let cartItem: CartEntity;
	export let hasInputUpdated = false;

	let showCalendar = false;

	let calendarDate = cartItem?.sipDay;
	let calendarMonth = new Date()?.toLocaleString('default', { month: 'short' });
	let calendarYear = new Date()?.getFullYear();
	let tempCalendarDate = calendarDate;
	let tempCalendarMonth = calendarMonth;
	let tempCalendarYear = calendarYear;
	let firstSipPayment = true;
	let dateSuperscript = 'th';
	let calanderDisplayDate = getDisplayDate(calendarDate);
	let instalmentDatesDetails: instalmentDate[];
	let showInstalmentDateBufferRemark = false;

	let sipAllowedDaysArray = cartItem?.sipAllowedDays?.length
		? cartItem?.sipAllowedDays?.trim()?.split(',') || []
		: [];

	let dateArray: Array<dateArrayTypes> = [{ value: 1, disabled: false }];

	const nextSipDateBufferDaysWithFtp = 30;
	const nextSipDateBufferDaysWithoutFtp = 10;
	const calendarDaysInMonth = 31;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	$: {
		dateArray.pop();

		for (let i = 1; i <= calendarDaysInMonth; i++) {
			dateArray.push({
				value: i,
				disabled:
					sipAllowedDaysArray.length === 0
						? false
						: (sipAllowedDaysArray || []).findIndex((d: string) => parseInt(d) === i) === -1
			});
		}
	}

	const setShowInstalmentDateBufferRemark = (currentDate: Date, todayMonthNumber: number) => {
		const nextSipMonthNumber = getSIPMonthBasedOnDate(
			tempCalendarDate,
			currentDate,
			firstSipPayment ? nextSipDateBufferDaysWithFtp : nextSipDateBufferDaysWithoutFtp
		);

		if (nextSipMonthNumber - todayMonthNumber > 1) {
			showInstalmentDateBufferRemark = true;
		} else {
			showInstalmentDateBufferRemark = false;
		}
	};

	const setInstalmentDates = () => {
		instalmentDatesDetails = [];

		if (firstSipPayment) {
			instalmentDatesDetails = getInstalmentDateDetailsFtp(
				tempCalendarDate,
				tempCalendarMonth,
				tempCalendarYear
			);

			const currentDate = new Date();
			const todayMonthNumber: string | number = currentDate?.getMonth() + 1;
			setShowInstalmentDateBufferRemark(currentDate, todayMonthNumber);
		} else {
			instalmentDatesDetails?.push({
				title: 'First Instalment',
				date: `${tempCalendarDate} ${tempCalendarMonth} ${tempCalendarYear}`
			});

			showInstalmentDateBufferRemark = false;
		}
	};

	function toggleCalendar() {
		showCalendar = !showCalendar;

		handleDateSelect({ detail: cartItem.sipDay });
		setInstalmentDates();
	}

	const handleDateSelect = (value: unknown) => {
		tempCalendarDate = value?.detail;

		const now = new Date();
		const month = getSIPMonthBasedOnDate(
			tempCalendarDate,
			now,
			firstSipPayment ? nextSipDateBufferDaysWithFtp : nextSipDateBufferDaysWithoutFtp
		);
		tempCalendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});

		tempCalendarYear = getSIPYearBasedOnDate(
			tempCalendarDate,
			now,
			firstSipPayment ? nextSipDateBufferDaysWithFtp : nextSipDateBufferDaysWithoutFtp
		);

		setInstalmentDates();
	};

	const handleDateChange = (value: unknown) => {
		calendarDate = value?.detail;
		dateSuperscript = getDateSuperscript(calendarDate);
		hasInputUpdated = true;
		cartItem.sipDay = calendarDate;
		calanderDisplayDate = getDisplayDate(calendarDate);
		toggleCalendar();
	};

	function getDisplayDate(selectedDate: number) {
		return selectedDate + getDateSuperscript(selectedDate);
	}
	handleDateSelect({ detail: cartItem.sipDay });
</script>

<div class="relative flex items-center max-sm:justify-end sm:h-full">
	<Button
		variant="transparent"
		class="relative flex !h-auto !w-full !max-w-fit flex-nowrap items-center justify-between rounded-sm !bg-tint12-primary !p-1"
		size="xs"
		onClick={toggleCalendar}
	>
		<span class="mr-1 text-left text-1xs font-normal leading-3 text-title"
			>SIP Date : {calanderDisplayDate}</span
		>
		<WMSIcon name="calander-icon" stroke="var(--PRIMARY)" width={10} height={10} />
	</Button>
	{#if showCalendar}
		<Modal isModalOpen={showCalendar} on:backdropclicked={toggleCalendar}>
			<CalendarComponent
				visible={showCalendar}
				title={'Select SIP Instalment Date'}
				heading={'CONFIRM'}
				showClose={!isMobile && !isTablet}
				showSubmit={true}
				{dateArray}
				defaultValue={calendarDate}
				on:submit={handleDateChange}
				on:dateSelect={handleDateSelect}
				on:close={toggleCalendar}
				class="z-60 sm:w-120"
			>
				<svelte:fragment slot="dateSlot">
					<InstalmentDates
						instalmentDateList={instalmentDatesDetails}
						showRemark={showInstalmentDateBufferRemark}
					/>
				</svelte:fragment>
			</CalendarComponent>
		</Modal>
	{/if}
</div>
