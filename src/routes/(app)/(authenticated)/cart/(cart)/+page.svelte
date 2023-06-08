<script lang="ts">
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import ErrorLoadingComponent from '$components/ErrorLoadingComponent.svelte';
	import CartGridTable from './CartGridTable.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<article>
	<header class="hidden sm:block">
		<PageTitle title="Cart" class="mb-0 sm:mb-4 sm:flex" />
	</header>
	<section class="ml-[calc(50%-50vw)] w-screen shadow-csm sm:ml-0 sm:w-full sm:shadow-none">
		{#await data.api.cart}
			<TableSkeleton />
		{:then cart}
			<CartGridTable cartItems={cart.data || []} />
		{:catch}
			<ErrorLoadingComponent
				title="Error Fetching Cart items"
				message="We could not fetch your cart items due to a technical error. Please try again."
			/>
		{/await}
	</section>
</article>
