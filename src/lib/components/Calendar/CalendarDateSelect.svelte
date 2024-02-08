<script lang="ts">
	import CalendarComponent from '$components/Calendar/CalendarComponent.svelte';
	import NextSipDate from '$components/Calendar/NextSipDate.svelte';
	import Modal from '$components/Modal.svelte';
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import type { dateArrayTypes } from '$lib/types/Calendar/ICalendar';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import {
		getDateSuperscript,
		getRandomDate,
		getSIPMonthBasedOnDate,
		getSIPYearBasedOnDate
	} from '$lib/utils/helpers/date';
	import { createEventDispatcher, onMount } from 'svelte';

	export let schemeData: SchemeDetails;
	export let nextSipDateBufferDays = 30;
	export let minDefaultDate = 1;
	export let maxDefaultDate = 5;

	const dispatch = createEventDispatcher();

	let calendarDate = new Date(schemeData?.sipDate)?.getDate();
	let calendarMonth = new Date(schemeData?.sipDate)?.toLocaleString('default', { month: 'short' });
	let calendarYear = new Date(schemeData?.sipDate)?.getFullYear();
	let tempCalendarDate = calendarDate;
	let tempCalendarMonth = calendarMonth;
	let tempCalendarYear = calendarYear;
	let dateSuperscript = 'th';
	let showCalendar = false;

	let sipAllowedDaysArray = schemeData?.sipAllowedDays?.length
		? schemeData?.sipAllowedDays?.trim()?.split(',') || []
		: [];

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

	const setDefaultSipDate = () => {
		let areAllDaysAllowed = true;
		for (let i = 1; i <= 28; i++) {
			if (parseInt(sipAllowedDaysArray[i - 1]) !== i) {
				areAllDaysAllowed = false;
			}
		}

		if (areAllDaysAllowed) {
			calendarDate = getRandomDate(minDefaultDate, maxDefaultDate);
		} else if (sipAllowedDaysArray?.length) {
			calendarDate = parseInt(sipAllowedDaysArray[0]);
		} else {
			calendarDate = 1;
		}
		dateSuperscript = getDateSuperscript(calendarDate);
	};

	const setNextSipDate = () => {
		const now = new Date();
		const month = getSIPMonthBasedOnDate(calendarDate, now, nextSipDateBufferDays);
		calendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});
		calendarYear = getSIPYearBasedOnDate(calendarDate, now, nextSipDateBufferDays);

		dispatch('dateChange', { calendarDate, calendarMonth, calendarYear });
	};

	const toggleCalendar = () => {
		showCalendar = !showCalendar;

		tempCalendarDate = calendarDate;
		tempCalendarMonth = calendarMonth;
		tempCalendarYear = calendarYear;
		dateSuperscript = getDateSuperscript(tempCalendarDate);
	};

	const handleDateSelect = (value: unknown) => {
		tempCalendarDate = value?.detail;

		const now = new Date();
		const month = getSIPMonthBasedOnDate(tempCalendarDate, now, nextSipDateBufferDays);
		tempCalendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});

		tempCalendarYear = getSIPYearBasedOnDate(tempCalendarDate, now, nextSipDateBufferDays);
	};

	const handleDateChange = (value: unknown) => {
		calendarDate = value?.detail;
		dateSuperscript = getDateSuperscript(calendarDate);

		setNextSipDate();
		toggleCalendar();
	};

	onMount(() => {
		setDefaultSipDate();
		setNextSipDate();

		dispatch('dateChange', { calendarDate, calendarMonth, calendarYear });
	});
</script>

<article class="flex w-5/12 flex-col items-start p-2" data-testid="calendarDateSelection">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<section
		class="flex items-center justify-between rounded border border-border md:cursor-pointer"
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
			class="w-3/4 rounded bg-background-alt px-3 py-2 text-base font-normal leading-none text-title outline-none"
		/>
		<section class="border-l p-2.5">
			<CalendarSmallIcon />
		</section>
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
		</CalendarComponent>
	</Modal>
{/if}
