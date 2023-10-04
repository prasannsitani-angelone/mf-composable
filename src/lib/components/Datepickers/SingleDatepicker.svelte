<script lang="ts">
	import { CalendarView } from 'fluent-svelte';
	import type { DatepickerEntity } from '$lib/types/IDatepicker';
	const today = new Date();
	const defaultStartDate = new Date(today.getFullYear() - 50, 0, 1);

	export let selected = today;
	export let minDate = defaultStartDate;
	export let maxDate = today;
	export let onChange = (args: DatepickerEntity) => args;

	let selectedd = new Date(selected);

	$: {
		onChange({ selected: selectedd, hasChosen: true });
	}
</script>

<div class="dp-con">
	<CalendarView
		min={minDate ? new Date(minDate) : defaultStartDate}
		max={maxDate ? new Date(maxDate) : today}
		bind:value={selectedd}
	/>
</div>

<style>
	/* Fluent svelte datepicker */
	.dp-con :global(.calendar-view-header) {
		position: relative;
		border: none !important;
		padding-top: 1rem !important;
	}

	.dp-con :global(.calendar-view-header > .calendar-view-header-text) {
		position: absolute !important;
		width: 10rem !important;
		margin: auto !important;
		left: 0 !important;
		right: 0 !important;
	}

	.dp-con :global(.calendar-view-header > .calendar-view-header-text > button) {
		width: 100%;
		margin: auto;
		justify-content: center;
		background: #f4f6fb;
		border-radius: 0.25rem;
		color: #3f5bd9;
		font-family: 'Roboto';
		font-style: normal;
		font-weight: 500;
		font-size: 1rem;
		padding: 0.5rem 0;
	}
	.dp-con :global(.calendar-view-header > div.calendar-view-pagination-controls) {
		width: 100%;
		justify-content: space-between;
	}

	.dp-con
		:global(.calendar-view-header > div.calendar-view-pagination-controls > button:first-child) {
		background: url('/images/arrow-previous-circle.svg') no-repeat 0 0;
		margin: 0;
		inline-size: 2.125rem;
	}
	.dp-con
		:global(.calendar-view-header > div.calendar-view-pagination-controls > button:last-child) {
		background: url('/images/arrow-next-circle.svg') no-repeat 0 0;
		margin: 0;
		inline-size: 2.125rem;
	}

	.dp-con :global(.calendar-view-header > div.calendar-view-pagination-controls > button:disabled) {
		opacity: 0.5;
	}

	.dp-con :global(.calendar-view-header > div.calendar-view-pagination-controls > button > svg) {
		display: none;
	}

	.dp-con :global(.calendar-view .calendar-view-item.selected) {
		background: rgba(63, 91, 217, 0.24) !important;
		border: none;
		color: #2a394e;
	}

	.dp-con :global(.calendar-view) {
		border: 0 !important;
		font-family: 'Roboto' !important;
		inline-size: 25rem !important;
		max-width: 90vw;
	}
	.dp-con :global(.calendar-view .calendar-view-table-wrapper) {
		inline-size: 25rem !important;
		max-width: 90vw;
	}
	.dp-con :global(.calendar-view .calendar-view-item) {
		border-radius: 0.25rem !important;
		font-size: 1rem !important;
		font-weight: 500;
		color: #2a394e;
		font-family: 'Roboto' !important;
	}

	.dp-con :global(.calendar-view .calendar-view-item:hover) {
		background: #f3f3f3;
		color: #3f5bd9;
	}

	.dp-con :global(.calendar-view .calendar-view-item.out-of-range) {
		opacity: 0.4;
		font-weight: 300;
	}

	.dp-con :global(.calendar-view .calendar-view-item.disabled) {
		opacity: 0.4;
		font-weight: 300;
	}

	.dp-con :global(.calendar-view .calendar-view-item.type-day.current) {
		background-color: transparent;
		border: 1px solid rgb(63, 91, 217);
		color: #2a394e;
	}

	.dp-con :global(.calendar-view .calendar-view-table.view-days th) {
		color: #2a394e !important;
		font-family: 'Roboto';
		font-weight: 300;
		font-size: 1rem;
	}

	.dp-con :global(.calendar-view .calendar-view-table td) {
		text-align: center;
	}
</style>
