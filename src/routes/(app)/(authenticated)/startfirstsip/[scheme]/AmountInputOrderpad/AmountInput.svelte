<script lang="ts">
	import MinusBlueIcon from '$lib/images/icons/MinusBlueIcon.svelte';
	import PlusBlueIcon from '$lib/images/icons/PlusBlueIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { createEventDispatcher } from 'svelte';

	export let amount: number;

	const dispatch = createEventDispatcher();

	const plusClick = () => {
		dispatch('plusClick');
	};

	const minusClick = () => {
		dispatch('minusClick');
	};
</script>

<article>
	<section class="flex items-center justify-between">
		<div class="flex items-start">
			<span class="mt-1.5 text-xs font-normal text-black-bolder">₹</span>
			<span class="ml-0.5 text-3xl font-normal text-black-key">
				{addCommasToAmountString(amount)}
			</span>
		</div>

		<article class="flex items-center">
			<button on:click={minusClick}><MinusBlueIcon /></button>
			<button on:click={plusClick} class="ml-2"><PlusBlueIcon /></button>
		</article>
	</section>
</article>
