<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { DateTagClasses } from '$lib/types/Calendar/ICalendar';

	const dispatch = createEventDispatcher();

	export let value: number;
	export let disabled: boolean;
	export let selected: boolean;
	export let classes: DateTagClasses | undefined;

	$: selectedClass = selected ? `rounded bg-tint12-primary !text-primary ${classes?.selected}` : '';
	$: disabledClass = disabled
		? `!text-disabled !sm:text-disabled !cursor-not-allowed ${classes?.disabled}`
		: '';

	const DateTagClass =
		'flex justify-center items-center w-min px-2 py-2 sm:px-3 sm:py-3 text-base sm:text-lg font-normal text-title cursor-pointer';

	const onClick = () => {
		dispatch('dateTagClicked');
	};
</script>

<div
	class="{DateTagClass} {classes?.default} {selectedClass} {disabledClass}"
	role="button"
	tabindex="0"
	on:click={onClick}
	on:keypress
>
	{value}
</div>
