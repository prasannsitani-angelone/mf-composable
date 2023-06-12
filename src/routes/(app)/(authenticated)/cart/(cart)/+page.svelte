<script lang="ts">
	import { onMount } from 'svelte/internal';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import ErrorLoadingComponent from '$components/ErrorLoadingComponent.svelte';
	import CartGridTable from './CartGridTable.svelte';
	import EmptyCartScreen from './components/EmptyCartScreen.svelte';
	import { cartStore } from '$lib/stores/CartStore';
	import type { CartEntity } from '$lib/types/ICartStore';
	import { mountAddToCartAnalytics } from '../analytics/cart';
	import { createCartEventMetaDataAnalytics } from './utils';

	import type { PageData } from './$types';

	function updateCartStore(cartItems: CartEntity[]) {
		cartStore.updateStore(cartItems);
	}

	export let data: PageData;

	onMount(() => {
		data.api.cart.then((res: { data: CartEntity[] }) => {
			updateCartStore(res.data);
			mountAddToCartAnalytics(createCartEventMetaDataAnalytics(res.data));
		});
	});
</script>

<article>
	<header class="hidden sm:block">
		<PageTitle title="Cart" class="mb-0 sm:mb-4 sm:flex" />
	</header>
	<section class="ml-[calc(50%-50vw)] w-screen shadow-csm sm:ml-0 sm:w-full sm:shadow-none">
		{#await data.api.cart}
			<TableSkeleton />
		{:then cart}
			{#if cart.data && Array.isArray(cart.data) && cart.data.length > 0}
				<CartGridTable cartItems={cart.data || []} />
			{:else}
				<EmptyCartScreen />
			{/if}
		{:catch}
			<ErrorLoadingComponent
				title="Error Fetching Cart items"
				message="We could not fetch your cart items due to a technical error. Please try again."
			/>
		{/await}
	</section>
</article>
