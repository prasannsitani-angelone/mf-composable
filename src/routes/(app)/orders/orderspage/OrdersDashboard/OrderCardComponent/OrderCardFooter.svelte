<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { orderItem } from '$lib/types/IOrderItem';

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
			{item?.transactionType === 'SWITCH' ? 'RETRY SWITCH' : 'RETRY PAYMENT'}
		</button>
	</article>
</section>
