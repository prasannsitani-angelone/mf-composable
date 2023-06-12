<script lang="ts">
	import { onMount } from 'svelte/internal';
	import { SEO, WMSIcon } from 'wms-ui-component';
	import type { PageData } from './$types';
	import { cartStore } from '$lib/stores/CartStore';
	import ReadOnlyTile from '../components/ReadOnlyTile.svelte';
	import type { RemoveCartItem } from '$lib/types/ICartStore';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import { mountManageCartAnalytics, deleteFromCartAnalytics } from '../analytics/cart';

	const onFundDelete = (item: RemoveCartItem) => {
		cartStore.showRemoveFromCartPopup(item);
		deleteFromCartAnalytics();
	};

	const handleBackNavigation = () => {
		history.back();
	};

	onMount(() => {
		mountManageCartAnalytics();
	});

	export let data: PageData;
</script>

<SEO seoTitle="Manage Your Cart | Angelone" seoDescription="Manage your Mutual funds cart" />
<section class="mb-6 hidden items-center gap-4 sm:flex">
	<WMSIcon
		name="left-arrow"
		class="cursor-pointer"
		width={14}
		height={14}
		on:click={handleBackNavigation}
	/> <span class="text-lg font-medium text-black-title">Manage Cart</span>
</section>
{#await data?.api?.cartItems}
	<SkeletonWrapper>
		{#each [1, 2, 3, 4, 5] as _}
			<SkeletonRectangle class="mb-2 h-20" />
		{/each}
	</SkeletonWrapper>
{:then cartItems}
	<div
		class="hidden grid-cols-[46%_16%_16%_16%_6%] items-center rounded-t border-b border-t border-grey-line bg-white px-6 py-4 text-sm font-medium text-grey-dark sm:grid"
	>
		<div>Fund</div>
		<div>Investment Type</div>
		<div>SIP Date</div>
		<div>Amount</div>
		<div class="h-6 w-6 pr-3" />
	</div>
	{#each cartItems as cartItem}
		<ReadOnlyTile
			{onFundDelete}
			cartItemId={cartItem?.cartItemId}
			showDelete={true}
			amount={cartItem?.amount}
			schemeName={cartItem?.schemeName}
			schemeLogo={cartItem?.logoUrl}
			sipDate={4}
			isSip={cartItem.investmentType === 'SIP'}
		/>
	{/each}
{/await}
