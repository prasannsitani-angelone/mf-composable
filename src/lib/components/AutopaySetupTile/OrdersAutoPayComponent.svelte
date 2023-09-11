<script lang="ts">
	import UPIMandateIcon from '$lib/images/icons/UPIMandateIcon.svelte';
	import { Button } from 'svelte-components';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const UPI_MANDATE_MAX_AMOUNT = 15000;
	export let amount: number;
	const autoPayClick = () => {
		dispatch('autoPayClick', { amount });
	};
</script>

<article
	class="mb-3 mt-1 flex max-w-4xl flex-col items-center rounded-lg bg-white p-4 py-6 shadow-csm {$$props.class}"
>
	<UPIMandateIcon class="h-[124px] w-[165px]" />

	{#if amount <= UPI_MANDATE_MAX_AMOUNT}
		<p class="mb-2 mt-6 text-sm font-semibold text-black-title">Set Up UPI Autopay</p>

		<p class="mb-4 text-xs text-black-title">Automate your SIP payments in 2 simple steps</p>

		<Button onClick={autoPayClick} class="w-full">SET UP UPI AUTOPAY</Button>
	{:else}
		<p class="mb-2 mt-6 text-sm font-semibold text-black-title">Set Up Autopay Now</p>

		<p class="mb-4 text-xs text-black-title">Make SIP payments automatically with Autopay</p>

		<Button onClick={autoPayClick} class="w-full">SET UP AUTOPAY</Button>
	{/if}
</article>
