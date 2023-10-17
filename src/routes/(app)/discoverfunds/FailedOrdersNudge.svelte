<script lang="ts">
	import { base } from '$app/paths';
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { goto } from '$app/navigation';
	import type { IRetryPaymentNudge } from '$lib/types/INudge';
	import SchemeLogo from '$components/SchemeLogo.svelte';

	let orderCount = 0;
	let order: IRetryPaymentNudge;

	const navigateToInvestmentPad = () => {
		const reRouteUrl = 'schemes';
		let routerPath = `${reRouteUrl}/${normalizeFundName(
			order?.schemeName,
			order?.isin,
			order?.schemeCode
		)}`;
		let params = encodeObject({
			orderId: order?.orderID,
			pgTxnId: order?.pgTxnId,
			investmentType: order?.investmentType === 'ONE-TIME' ? 'LUMPSUM' : 'SIP',
			investmentAmount: order?.amount
		});
		goto(`${base}/${routerPath}?params=${params}&orderpad=INVEST`);
	};

	const navigateToOrdersPage = () => {
		goto(`${base}/orders/orderspage`);
	};

	export { orderCount, order };
</script>

<section class="mt-2 rounded-lg shadow-csm">
	<div
		class="via-yellow flex items-center justify-start gap-3 rounded-tl rounded-tr-lg border-l-4 border-yellow-primary bg-gradient-to-r from-white to-yellow-50 px-4 py-2"
	>
		<WMSIcon name="alert-icon" />
		<p class="text-xs font-normal text-black">Order Payment Failed</p>
	</div>
	<div class="rounded-b-lg bg-white px-2 pb-3 pt-4">
		<div>
			{#if orderCount === 1}
				<p class="text-xs font-normal text-grey-body lg:px-4">
					{order?.orderDate}
				</p>
			{/if}
			<ResultItem
				class="justify-between px-0 py-3 {orderCount > 1 && 'pt-0'}"
				data={{
					logoUrl: `${order.logoUrl}`,
					categoryName: '',
					schemeName: `${order.schemeName}`
				}}
				itemStyle="border-none items-center"
				titleStyle={orderCount > 1 ? '!ml-6' : ''}
			>
				<svelte:fragment slot="schemeLogo">
					{#if orderCount > 1}
						<div class="w-18 relative">
							<SchemeLogo src={order.logoUrl} alt="logo" />
							<span
								class="absolute left-6 top-0 z-10 mr-3 h-12 w-12 rounded-full border bg-white object-cover py-4 text-center text-xs font-normal shadow-csm"
								>+ {orderCount - 1}</span
							>
						</div>
					{:else}
						<SchemeLogo src={order.logoUrl} alt="logo" />
					{/if}
				</svelte:fragment>

				<svelte:fragment slot="ratingSection">
					{#if orderCount === 1}
						<span class="rounded-sm bg-grey p-1 text-3xs font-normal">{order.investmentType}</span>
					{:else}
						<span />
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="returns">
					<section class="flex flex-col items-end font-normal">
						<span class="text-sm font-normal"
							>₹{addCommasToAmountString(order?.amount?.toString())}</span
						>
						<span
							class="flex items-center gap-1 rounded-sm bg-red-sell bg-opacity-12 p-1 text-3xs font-normal"
						>
							<WMSIcon name="red-exclamation" width={12} height={12} /> FAILED</span
						>
					</section>
				</svelte:fragment>
			</ResultItem>
		</div>
		<div class="border-t border-grey-line pt-1 text-right">
			{#if orderCount === 1}
				<ButtonMedium
					size="xs"
					class="pr-0 text-xs"
					variant="transparent"
					on:click={navigateToInvestmentPad}
				>
					RETRY PAYMENT
				</ButtonMedium>
			{:else}
				<ButtonMedium
					class="pr-0 text-xs"
					size="xs"
					variant="transparent"
					on:click={navigateToOrdersPage}
				>
					VIEW ORDERS
				</ButtonMedium>
			{/if}
		</div>
	</div>
</section>
