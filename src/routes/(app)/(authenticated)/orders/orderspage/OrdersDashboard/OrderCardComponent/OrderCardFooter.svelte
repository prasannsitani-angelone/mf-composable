<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { orderItem } from '$lib/types/IOrderItem';
	import { INVESTMENT_TYPE } from '$lib/constants/transactionType';

	const dispatch = createEventDispatcher();
	export let item: orderItem;
	const handleButtonClick = () => {
		dispatch('buttonCta', item);
	};
</script>

<section class="mt-3">
	<article class="flex items-center justify-end border-t pt-4">
		<button
			class="flex items-center text-xs font-semibold text-blue-primary md:text-sm"
			on:click={handleButtonClick}
		>
			{item?.investmentType === INVESTMENT_TYPE.SWITCH_IN ||
			item?.investmentType === INVESTMENT_TYPE.SWITCH_OUT
				? 'RETRY SWITCH'
				: 'RETRY PAYMENT'}
		</button>
	</article>
</section>
