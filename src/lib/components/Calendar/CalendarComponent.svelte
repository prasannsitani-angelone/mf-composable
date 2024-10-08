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
		class={`flex w-full flex-col rounded-b-none rounded-t-2xl bg-background-alt shadow-clg sm:rounded-lg ${$$props?.class}`}
	>
		<div
			class={`flex flex-row px-4 py-6 pb-0 md:pb-6 ${classes?.header} ${
				showClose ? 'justify-between' : ''
			}`}
		>
			<span
				class={`text-sm font-medium text-body sm:text-xl sm:font-normal sm:text-title ${classes?.title}`}
			>
				{title}
			</span>
			<slot name="crossButton">
				{#if showClose}
					<div class="md:cursor-pointer" role="button" tabindex="0" on:click={onClose} on:keypress>
						<CrossInCircleIcon />
					</div>
				{/if}
			</slot>
		</div>

		<div class={`hidden border-t sm:block ${classes?.midBorder}`} />
		<div class={`grid grid-cols-7 justify-items-center px-2 py-4 md:py-2 ${classes?.content}`}>
			{#each dateArray as date}
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
