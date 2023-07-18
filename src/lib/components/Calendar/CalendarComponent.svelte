<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DateTag from './DateTag.svelte';
	import Button from '$components/Button.svelte';
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';
	import type { Classes, DateObj } from '$lib/types/Calendar/ICalendar';

	const dispatch = createEventDispatcher();

	export let visible: boolean;
	export let title: string;
	export let heading: string;
	export let showClose: boolean;
	export let showSubmit: boolean;
	export let dateArray: Array<DateObj>;
	export let defaultValue: number;
	export let classes: Classes = {};

	let selectedDate = defaultValue || 1;

	const onSubmit = () => {
		dispatch('submit', selectedDate);
	};

	const onClose = () => {
		dispatch('close');
	};

	const dateChangeFunc = (dateData: DateObj) => {
		if (dateData?.disabled) {
			return;
		}

		selectedDate = dateData?.value;

		if (showSubmit) {
			dispatch('dateSelect', dateData?.value);
		} else {
			onSubmit();
		}
	};
</script>

{#if visible}
	<div
		class={`flex w-full flex-col rounded-b-none rounded-t-2xl bg-white shadow-clg sm:rounded-lg ${$$props?.class}`}
	>
		<div
			class={`flex flex-row justify-center px-8 py-6 pb-0 md:pb-6 ${classes?.header} ${
				showClose ? 'justify-between' : ''
			}`}
		>
			<span
				class={`text-sm font-semibold text-grey-body sm:text-xl sm:font-medium sm:text-black-title ${classes?.title}`}
			>
				{title}
			</span>
			{#if showClose}
				<div
					class="md:cursor-pointer"
					on:click={onClose}
					on:keydown={() => {
						// add logic
					}}
				>
					<CrossInCircleIcon />
				</div>
			{/if}
		</div>

		<div class={`hidden border-t border-grey-line sm:block ${classes?.midBorder}`} />
		<div
			class={`grid grid-cols-7 justify-items-center px-2 py-4 sm:px-6 sm:py-8 ${classes?.content}`}
		>
			{#each dateArray as date, index}
				<DateTag
					value={date?.value}
					disabled={date?.disabled}
					selected={selectedDate === date?.value}
					classes={classes?.dateTag}
					on:dateTagClicked={() => dateChangeFunc(date)}
				/>
			{/each}
		</div>
		<slot name="dateSlot" />
		{#if showSubmit}
			<div class={`flex flex-row justify-center rounded-b-lg px-4 py-4 ${classes?.footer}`}>
				<Button class="w-full rounded" onClick={onSubmit}>
					{heading}
				</Button>
			</div>
		{/if}
		<slot name="footer" />
	</div>
{/if}
