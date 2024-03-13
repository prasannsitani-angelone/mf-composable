<script lang="ts">
	import { base } from '$app/paths';
	import { modifiedGoto } from '$lib/utils/goto';
	import { createEventDispatcher, onMount } from 'svelte';
	import { BtnVariant, WMSIcon } from 'svelte-components';
	import { Button } from 'svelte-components';

	const dispatch = createEventDispatcher();

	let cartItemCount = 0;

	const handleCartEntryClick = () => {
		dispatch('cartEntryClick');
		modifiedGoto(`${base}/cart`);
	};

	onMount(() => {
		dispatch('cartEntryMount');
	});

	export { cartItemCount };
</script>

{#if cartItemCount}
	<article
		class="absolute inset-0 bottom-20 left-auto right-2 top-auto z-10 md:hidden lg:bottom-11 lg:right-11 {$$props?.class}"
	>
		<Button
			variant={BtnVariant?.Contained}
			class="w-full rounded-full"
			onClick={handleCartEntryClick}
		>
			<WMSIcon name="cart-filled" width={18} height={16} fill="var(--BACKGROUND)" />
			<span class="ml-1 font-medium">Cart({cartItemCount})</span>
		</Button>
	</article>
{/if}
