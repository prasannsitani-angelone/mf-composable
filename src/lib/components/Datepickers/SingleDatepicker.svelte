<script lang="ts">
	import { InlineCalendar } from 'svelte-calendar';
	import { light } from './theme';
	import type { DatepickerEntity } from '$lib/types/IDatepicker';
	const today = new Date();
	const defaultStartDate = new Date(today.getFullYear() - 50, 0, 1);
	let store;

	export let selected = today;
	export let minDate = defaultStartDate;
	export let maxDate = today;
	export let format = 'YYYY/MM/DD';
	export let onChange = (args: DatepickerEntity) => args;

	$: {
		onChange($store);
	}
</script>

<div class="dp-con">
	<InlineCalendar
		selected={new Date(selected)}
		bind:store
		theme={light}
		{format}
		end={maxDate ? new Date(maxDate) : today}
		start={minDate ? new Date(minDate) : defaultStartDate}
	/>
</div>

<style>
	.dp-con {
		width: fit-content;
		display: inline-flex;
		margin: 0 auto;
	}
	.dp-con > :global(div > .grid) {
		padding: 0 0.5rem 1rem;
	}
	.dp-con :global(.controls span.label) {
		justify-content: center;
		background: #f4f6fb;
		border-radius: 0.25rem;
		color: #3f5bd9;
		font-family: 'Barlow';
		font-style: normal;
		font-weight: 500;
		font-size: 1rem;
	}
	.dp-con :global(.controls .button i) {
		height: 0.5rem;
		width: 0.5rem;
		border-style: solid;
		border-color: #2a394e;
		border-width: 0;
		border-bottom-width: 2px;
		border-right-width: 2px;
	}
	.dp-con :global(.controls .button.label) {
		width: fit-content;
		margin: auto;
		height: fit-content;
		padding: 0.5rem 1rem;
	}
	.dp-con :global(.controls div.button) {
		height: auto;
		padding: 0.75rem;
		margin: 1rem 0;
		border: 1px solid #e8ebf1;
		border-radius: 50%;
	}
	.dp-con :global(.controls div.button i.left) {
		position: relative;
		left: -0.25rem;
	}
	.dp-con :global(.controls div.button i.right) {
		position: relative;
		left: 0.25rem;
	}
	.dp-con :global(.controls) {
		height: auto;
	}
	.dp-con :global(.contents .stage .grid a) {
		border-radius: 0.25rem;
		font-weight: 500;
	}
	.dp-con :global(.contents .stage .grid a:hover) {
		color: #3f5bd9;
	}
	.dp-con :global(.stage > div.grid > div > div.grid) {
		grid-template: repeat(6, 1fr) / repeat(7, 1fr) !important;
		column-gap: 1.25rem;
	}
	.dp-con :global(div > div.grid) {
		grid-template-rows: auto calc(
				min(var(--sc-theme-calendar-maxWidth), var(--sc-theme-calendar-width)) * 6 / 8 +
					var(--sc-theme-calendar-legend-height)
			);
	}
</style>
