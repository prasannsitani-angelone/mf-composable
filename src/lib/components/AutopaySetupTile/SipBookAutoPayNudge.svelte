<script lang="ts">
	import UPIMandateIcon from '$lib/images/icons/UPIMandateIcon.svelte';
	import { BtnSize, Button } from 'svelte-components';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const UPI_MANDATE_MAX_AMOUNT = 15000;
	export let amount: number;
	const autoPayClick = () => {
		dispatch('autoPayClick', { amount });
	};
</script>

<article
	class="mb-3 mt-1 flex flex-row items-center rounded-lg bg-white p-4 py-6 shadow-csm {$$props.class}"
>
	<div class="flex flex-1 flex-col">
		<p class="mb-2 text-sm font-medium text-black-title">Automate all future instalments</p>
		<p class="mb-4 text-xs text-black-title">
			Automating SIP is easier than ever.<br />Set it up in just 2 clicks.
		</p>

		<Button size={BtnSize.SM} onClick={autoPayClick} class="w-fit text-xs">
			{#if amount <= UPI_MANDATE_MAX_AMOUNT}
				SET UP UPI AUTOPAY
			{:else}
				SET UP AUTOPAY
			{/if}
		</Button>
	</div>

	<UPIMandateIcon />
</article>
