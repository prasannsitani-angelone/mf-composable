<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import type { orderItem } from '$lib/types/IOrderItem';

	const dispatch = createEventDispatcher();
	const handleButtonClick = () => {
		dispatch('buttonCta', item);
	};
	export let item: orderItem;
</script>

<section>
	<article class="flex items-center justify-end border-t px-4 py-3">
		<button
			class="flex items-center text-sm font-medium text-blue-primary"
			on:click={handleButtonClick}
		>
			{item?.transactionType === 'SWITCH' ? 'RETRY SWITCH' : 'RETRY PAYMENT'}
			<RightIcon class="ml-2" stroke="#3F5BD9" />
		</button>
	</article>
</section>
