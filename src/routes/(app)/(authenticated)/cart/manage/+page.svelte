<script lang="ts">
	import { onMount } from 'svelte/internal';
	import { SEO } from 'svelte-components';
	import type { PageData } from './$types';
	import { cartStore } from '$lib/stores/CartStore';
	import ReadOnlyTile from '../components/ReadOnlyTile.svelte';
	import type { RemoveCartItem } from '$lib/types/ICartStore';
	import ManageCartSkeletanLoader from './ManageCartSkeletanLoader.svelte';
	import { mountManageCartAnalytics, deleteFromCartAnalytics } from '../analytics/cart';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
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
	/> <span class="text-lg font-normal text-black-title">Manage Cart</span>
</section>
{#await data?.api?.cartItems}
	<ManageCartSkeletanLoader />
{:then cartItems}
	<div class="hidden bg-white sm:flex">
		<div
			class="w-full grid-cols-[55%_45%] items-center gap-y-2 rounded-t border-b border-t border-grey-line bg-white px-6 py-4 text-sm font-normal text-grey-dark sm:grid sm:grid-cols-[46%_18%_18%_18%] sm:items-center sm:px-6 sm:py-4"
		>
			<div>Fund</div>
			<div>Investment Type</div>
			<div>SIP Date</div>
			<div>Amount</div>
		</div>
		<div class="border-b border-t sm:flex sm:items-center sm:pl-4 sm:pr-12">
			<WMSIcon name="trash-icon" width={14} height={14} />
		</div>
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
