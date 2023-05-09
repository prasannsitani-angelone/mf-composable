<script lang="ts">
	import type { OrdersSummary } from '$lib/types/IInvestments';
	import type { orderItem } from '$lib/types/IOrderItem';
	import OrderCardFooter from './OrderCardComponent/OrderCardFooter.svelte';
	import type { PageData } from '../../../../$types';
	import NoOrdersPage from './NoOrdersPage.svelte';
	import OrderCardHeader from './OrderCardComponent/OrderCardHeader.svelte';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import OrderCardBody from './OrderCardComponent/OrderCardBody.svelte';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { OnNavigation } from '$lib/utils/navigation';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { page } from '$app/stores';
	import { failedOrdersRetryCtaClickAnalytics } from '$lib/analytics/orders/orders';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	import OrderFilter from './OrderFilter/OrderFilter.svelte';
	let ordersSummary: OrdersSummary;
	let inProgressOrders: orderItem[] = [];
	let failedOrders: orderItem[] = [];
	let compeletedOrders: orderItem[] = [];
	$: orders = [...compeletedOrders, ...inProgressOrders];
	let data: PageData;
	let schemeDetails: SchemeDetails;

	const appContext: AppContext = getContext('app');
	const handleFooterClick = async (e: CustomEvent) => {
		failedOrdersRetryCtaClickAnalytics();
		const orderItem: orderItem = e.detail;
		const schemeUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${orderItem?.isin}/${orderItem?.schemeCode}`;
		const schemeResponse = await useFetch(schemeUrl);
		if (schemeResponse.ok) {
			schemeDetails = schemeResponse?.data;
			// TODO: To change the navigation after the proper release
			const reRouteUrl = $page?.data?.deviceType?.isBrowser ? 'schemes' : 'schemes/invest';
			const path = `${reRouteUrl}/${normalizeFundName(
				schemeDetails?.schemeName,
				schemeDetails?.isin,
				schemeDetails?.schemeCode
			)}`;
			const params = encodeObject({
				orderId: orderItem?.orderId,
				pgTxnId: orderItem?.pgTxnId,
				investmentType: orderItem?.investmentType,
				investmentAmount: orderItem?.amount
			});
			OnNavigation();
			goto(
				`${getNavigationBaseUrl(base, appContext.scheme, appContext.host)}/${path}?params=${params}`
			);
		}
	};

	const handleCheck = (e: { detail: { [key: string]: boolean } }) => {
		orders = [];
		const filters = e.detail;
		if (filters.completed) {
			orders.push(...compeletedOrders);
		}
		if (filters.inprogress) {
			orders.push(...inProgressOrders);
		}
		if (filters.failed) {
			orders.push(...failedOrders);
		}
		if (!filters.completed && !filters.failed && !filters.inprogress) {
			orders.push(...compeletedOrders);
			orders.push(...inProgressOrders);
			orders.push(...failedOrders);
		}
	};

	// Sorting the orders desc by created Timestamp
	$: if (orders) {
		orders.sort((a, b) => {
			return b.createdTs - a.createdTs;
		});
	}

	const userType = profileStore.userType();
	export { ordersSummary, compeletedOrders, inProgressOrders, failedOrders, data };
</script>

{#if ordersSummary?.totalProcessingOrders || ordersSummary?.totalFailedOrders || ordersSummary?.totalCompletedOrders}
	<article class="hidden md:block">
		<OrderFilter {ordersSummary} on:checked={handleCheck} />
	</article>
	<article>
		<article class="block md:hidden">
			<OrderFilter {ordersSummary} on:checked={handleCheck} />
		</article>
		{#if orders.length}
			{#each orders as item (item?.orderId)}
				<article class="mb-1 rounded-lg border bg-white px-2 py-4 md:px-4">
					<OrderCardHeader textString={getDateTimeString(item?.createdTs, 'DATE', true)} />
					<OrderCardBody {item} />
					{#if isInvestmentAllowed(userType, item?.schemePlan) && item?.paymentStatus === 'failure' && item?.investmentType !== 'XSIP'}
						<OrderCardFooter {item} on:buttonCta={handleFooterClick} />
					{/if}
				</article>
			{/each}
		{:else}
			<NoOrdersPage {data} />
		{/if}
	</article>
{:else}
	<NoOrdersPage {data} />
{/if}
