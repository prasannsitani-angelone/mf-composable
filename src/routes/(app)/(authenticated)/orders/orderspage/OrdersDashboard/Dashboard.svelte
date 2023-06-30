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

	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import {
		allFiltersUncheckedAnalytics,
		clickCompletedCheckboxAnalytics,
		clickFailedCheckboxAnalytics,
		clickInProgressCheckboxAnalytics,
		failedOrdersRetryCtaDashboardClickAnalytics,
		ordersDashboardScreenOpenAnalytics
	} from '$lib/analytics/orders/orders';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import OrderFilter from './OrderFilter/OrderFilter.svelte';
	import { REVERSE_INVESTMENT_TYPE } from '$lib/constants/transactionType';
	import { filterStore } from '$lib/stores/FilterStore';
	import { userStore } from '$lib/stores/UserStore';
	import { onMount } from 'svelte';
	let ordersSummary: OrdersSummary;
	let inProgressOrders: orderItem[] = [];
	let failedOrders: orderItem[] = [];
	let compeletedOrders: orderItem[] = [];
	let orders: orderItem[] = [];
	let data: PageData;
	let schemeDetails: SchemeDetails;

	const handleFooterClick = async (e: CustomEvent) => {
		const orderItem: orderItem = e.detail;
		const eventMetaData = {
			Status: orderItem?.status?.toUpperCase()
		};
		failedOrdersRetryCtaDashboardClickAnalytics(eventMetaData);
		const schemeUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${orderItem?.isin}/${orderItem?.schemeCode}`;
		const schemeResponse = await useFetch(schemeUrl);
		if (schemeResponse.ok) {
			schemeDetails = schemeResponse?.data;
			// TODO: To change the navigation after the proper release
			const reRouteUrl = 'schemes';
			const path = `${reRouteUrl}/${normalizeFundName(
				schemeDetails?.schemeName,
				schemeDetails?.isin,
				schemeDetails?.schemeCode
			)}`;
			const params = encodeObject({
				orderId: orderItem?.orderId,
				pgTxnId: orderItem?.pgTxnId,
				investmentType: REVERSE_INVESTMENT_TYPE[orderItem?.investmentType?.toUpperCase()],
				investmentAmount: orderItem?.amount
			});

			goto(`${base}/${path}?params=${params}&orderpad=INVEST`);
		}
	};

	$: {
		orders = [];
		// const filters = e.detail;
		if ($filterStore.completed) {
			const eventMetaData = {
				Completed: `( ${compeletedOrders.length} )`
			};
			orders = [...orders, ...compeletedOrders];
			clickCompletedCheckboxAnalytics(eventMetaData);
		}
		if ($filterStore.inprogress) {
			const eventMetaData = {
				InProgress: `( ${inProgressOrders.length} )`
			};
			orders = [...orders, ...inProgressOrders];
			clickInProgressCheckboxAnalytics(eventMetaData);
		}
		if ($filterStore.failed) {
			const eventMetaData = {
				Failed: `( ${failedOrders.length} )`
			};
			orders = [...orders, ...failedOrders];
			clickFailedCheckboxAnalytics(eventMetaData);
		}
		if (!$filterStore.completed && !$filterStore.failed && !$filterStore.inprogress) {
			const eventMetaData = {
				InProgress: `( ${inProgressOrders.length} )`,
				Completed: `( ${compeletedOrders.length} )`,
				Failed: `( ${failedOrders.length} )`
			};
			allFiltersUncheckedAnalytics(eventMetaData);
			orders = [...compeletedOrders, ...failedOrders, ...inProgressOrders];
		}
		// Sorting the orders desc by created Timestamp
		if (orders) {
			orders.sort((a, b) => {
				return b.createdTs - a.createdTs;
			});
		}
	}

	onMount(() => {
		const eventMetaData: { [key: string]: string } = {
			'In Progress': `( ${ordersSummary?.totalProcessingOrders} )`,
			Completed: `( ${ordersSummary?.totalCompletedOrders} )`,
			Failed: `( ${ordersSummary?.totalFailedOrders} )`
		};
		if (
			!ordersSummary?.totalProcessingOrders &&
			!ordersSummary?.totalFailedOrders &&
			!ordersSummary?.totalCompletedOrders
		) {
			eventMetaData['Message'] = 'You do not have any orders currently';
		}
		ordersDashboardScreenOpenAnalytics(eventMetaData);
	});

	const userType = userStore.userType();
	export { ordersSummary, compeletedOrders, inProgressOrders, failedOrders, data };
</script>

{#if ordersSummary?.totalProcessingOrders || ordersSummary?.totalFailedOrders || ordersSummary?.totalCompletedOrders}
	<article class="hidden md:block">
		<OrderFilter {ordersSummary} />
	</article>
	<article>
		{#if orders.length}
			{#each orders as item (item?.orderId)}
				<article class="mb-1 rounded-lg border bg-white px-2 py-4 md:px-4">
					<OrderCardHeader textString={getDateTimeString(item?.createdTs, 'DATE', true)} />
					<OrderCardBody {item} />
					{#if isInvestmentAllowed(userType, item?.schemePlan) && item?.paymentStatus === 'failure' && item?.investmentType !== 'XSIP' && !item?.isNfoClosed}
						<OrderCardFooter {item} on:buttonCta={handleFooterClick} />
					{/if}
				</article>
			{/each}
		{:else}
			<NoOrdersPage {data} />
		{/if}
	</article>
{:else}
	<NoOrdersPage class="md:mt-0" {data} />
{/if}
