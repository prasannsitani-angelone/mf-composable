<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { formatAmount } from '$lib/utils/helpers/formatAmount';
	import ReadOnlyTile from '../components/ReadOnlyTile.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const onRefresh = async () => {
		invalidate('app:cart:confirmation');
	};

	const navigateToOrders = async () => {
		await goto(`${base}/orders/orderspage`, { replaceState: true });
	};
</script>

<article class="flex h-full flex-col">
	{#await data.api.itemList}
		<LoadingIndicator svgClass="!w-12 !h-12" class="self-center" />
	{:then itemList}
		{#if itemList.ok}
			<div>
				<div>
					<div
						class="hidden grid-cols-[46%_18%_18%_18%] items-center border-b border-t border-grey-line bg-white px-6 py-4 text-sm font-medium text-grey-dark sm:grid"
					>
						<div>Fund</div>
						<div>Investment Type</div>
						<div>SIP Date</div>
						<div>Amount</div>
					</div>
					{#each itemList.data?.data as item, id (id)}
						<ReadOnlyTile
							schemeName={item.schemeName}
							schemeLogo={item.logoUrl}
							amount={item.amount}
							sipDate={item.sipDay}
							isSip={item.investmentType === 'SIP'}
						/>
					{/each}
					<div
						class="grid grid-cols-[46%_18%_18%_18%] items-center bg-white px-3 py-3 sm:px-6 sm:py-4"
					>
						<div class="text-title-black text-sm font-bold">Total</div>
						<div
							class="text-title-black col-start-4 flex justify-end text-sm font-bold sm:justify-start"
						>
							₹{formatAmount(data.api.totalAmount?.toString())}
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex h-full flex-col items-center self-center px-4 py-4">
				<div class="mb-4 text-center text-base font-medium text-black-title">
					We are facing some issue at our end. Please try again or contact field support
				</div>
				<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
					REFRESH
				</Button>
				<Button variant="transparent" class="mt-6 w-max self-center" onClick={navigateToOrders}>
					GO TO ORDERS
				</Button>
			</div>
		{/if}
	{:catch}
		<div class="flex h-full flex-col items-center self-center px-4 py-4">
			<div class="mb-4 text-center text-base font-medium text-black-title">
				We are facing some issue at our end. Please try again or contact field support
			</div>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
				REFRESH
			</Button>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={navigateToOrders}>
				GO TO ORDERS
			</Button>
		</div>
	{/await}
</article>
