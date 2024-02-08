<script lang="ts">
	import UPIMandateIcon from '$lib/images/icons/UPIMandateIcon.svelte';
	import { BtnSize } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const UPI_MANDATE_MAX_AMOUNT = 15000;
	export let amount: number;
	const autoPayClick = () => {
		dispatch('autoPayClick', { amount });
	};

	export let heading = 'Automate all future instalments';
	export let description = 'Automating SIP is easier than ever.\nSet it up in just 2 clicks.';
</script>

<article
	class="mb-3 mt-1 flex flex-row items-center rounded-lg bg-background-alt p-4 py-6 shadow-csm {$$props.class}"
>
	<div class="flex flex-1 flex-col">
		<p class="mb-2 text-sm font-medium text-title">{heading}</p>
		<p class="mb-4 whitespace-pre-line text-xs text-title">{description}</p>

		<ButtonMedium size={BtnSize.SM} onClick={autoPayClick} class="w-fit text-xs">
			{#if amount <= UPI_MANDATE_MAX_AMOUNT}
				SET UP UPI AUTOPAY
			{:else}
				SET UP AUTOPAY
			{/if}
		</ButtonMedium>
	</div>

	<UPIMandateIcon />
</article>
