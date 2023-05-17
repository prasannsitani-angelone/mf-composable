<script lang="ts">
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';

	export let schemeName = '';
	export let amount = '';
	export let calendarDate: number;
	export let dateSuperscript = '';
	export let isSIP = false;
	export let onBackClick = (): void => undefined;
	export let clazz = '';
</script>

<article class={`z-10 flex flex-row items-center bg-white px-4 py-3 ${clazz}`}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click={onBackClick}>
		<LeftArrowIcon />
	</div>
	<div class="ml-3 flex flex-col overflow-hidden text-sm font-medium text-black-title">
		<div class="truncate">
			{schemeName}
		</div>

		<div class="mt-1.5 flex flex-row items-center">
			<div class="text-green-amount">
				<span> ₹ </span>
				<span class="ml-1">
					{amount}
				</span>
			</div>
			{#if isSIP}
				<div class="ml-4 flex items-center justify-start text-xs font-medium">
					<CalendarSmallIcon />
					<p class="ml-1 text-grey-body">
						{calendarDate}{dateSuperscript} of every month
					</p>
				</div>
			{/if}
		</div>
	</div>
</article>
