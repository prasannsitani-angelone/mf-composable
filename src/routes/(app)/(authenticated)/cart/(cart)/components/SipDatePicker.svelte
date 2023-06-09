<script lang="ts">
	import Button from '$components/Button.svelte';
	import CalendarComponent from '$components/Calendar/CalendarComponent.svelte';
	import Modal from '$components/Modal.svelte';
	import NextSipDate from '$components/Calendar/NextSipDate.svelte';
	import { WMSIcon } from 'wms-ui-component';
	import type { dateArrayTypes } from '$lib/types/Calendar/ICalendar';
	import {
		getDateSuperscript,
		getSIPMonthBasedOnDate,
		getSIPYearBasedOnDate
	} from '$lib/utils/helpers/date';
	import type { CartEntity } from '$lib/types/ICartStore';

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

	let sipAllowedDaysArray = cartItem?.sipAllowedDays?.length
		? cartItem?.sipAllowedDays?.trim()?.split(',') || []
		: [];

	let dateArray: Array<dateArrayTypes> = [{ value: 1, disabled: false }];

	$: {
		dateArray.pop();

		for (let i = 1; i <= 28; i++) {
			dateArray.push({
				value: i,
				disabled:
					sipAllowedDaysArray.length === 0
						? false
						: (sipAllowedDaysArray || []).findIndex((d: string) => parseInt(d) === i) === -1
			});
		}
	}

	function toggleCalendar() {
		showCalendar = !showCalendar;
	}

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
		class="relative flex !h-auto !w-full !max-w-fit items-center justify-between rounded-sm !bg-purple-background !p-1"
		size="xs"
		onClick={toggleCalendar}
	>
		<span class="mr-1 text-1xs font-medium leading-3 text-black-title"
			>SIP Date : {calanderDisplayDate}</span
		>
		<WMSIcon name="calander-icon" width={10} height={10} />
	</Button>
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
</div>
