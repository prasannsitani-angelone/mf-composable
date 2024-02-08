import { PUBLIC_MF_CORE_BASE_URL_V2 } from '$env/static/public';
import { faqsIconClick } from '$lib/analytics/faqs/faqs';
import { ORDER_STATUS } from '$lib/constants/orderFlowStatuses';
import type { OrdersSummary } from '$lib/types/IInvestments';
import type { IOrdersResponse, orderItem } from '$lib/types/IOrderItem';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { encodeObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import OrderTabSelection from './TabSelection/OrderTabSelection.svelte';

export const load = (async ({ fetch }) => {
	let ordersSummary: OrdersSummary;
	const ordersUrl = `${PUBLIC_MF_CORE_BASE_URL_V2}/orders`;
	const getOrdersData = async () => {
		const ordersResponse = await useFetch(ordersUrl + '?summary=true', {}, fetch);
		if (ordersResponse.ok) {
			const responseData = ordersResponse.data;
			ordersSummary = responseData?.data?.summary;
			const promises = [];
			let inProgressOrders: orderItem[] = [];
			let failedOrders: orderItem[] = [];
			let completedOrders: orderItem[] = [];
			if (ordersSummary?.totalProcessingOrders) {
				promises.push(
					useFetch(ordersUrl + '?status=ORDER_PROCESSING', {}, fetch)
						.then((res) => res.data)
						.then(({ data }: { data: IOrdersResponse }) => {
							inProgressOrders = data?.orders;
						})
				);
			}

			if (ordersSummary?.totalCompletedOrders) {
				promises.push(
					useFetch(ordersUrl + `?status=${ORDER_STATUS.ORDER_COMPLETE}`, {}, fetch)
						.then((res) => res.data)
						.then(({ data }: { data: IOrdersResponse }) => {
							completedOrders = data?.orders;
						})
				);
			}

			if (ordersSummary?.totalFailedOrders) {
				promises.push(
					useFetch(ordersUrl + '?status=ORDER_REJECTED', {}, fetch)
						.then((res) => res.data)
						.then(({ data }: { data: IOrdersResponse }) => {
							failedOrders = data?.orders;
						})
				);
			}
			await Promise.allSettled(promises);
			return {
				inProgressOrders,
				failedOrders,
				completedOrders,
				ordersSummary
			};
		} else if (ordersResponse?.status < 500) {
			return {
				inProgressOrders: [],
				failedOrders: [],
				completedOrders: [],
				ordersSummary
			};
		} else {
			return new Error('Something Went Wrong');
		}
	};

	const faqParams = encodeObject({
		tag: 'orders',
		showRecentOrders: true
	});

	const onClickFaqsIcon = () => {
		faqsIconClick({
			Source: 'Orders'
		});
	};

	return {
		// We are uisng hydrate here, because if we use browser and  as we are awaiting for promise.allSettled the hydrate gets updated because of which we see difference in CSR and SSR so API gets called again in client side
		layoutConfig: {
			title: 'All Orders',
			titleClass: '!text-xl',
			headerClass: '!bg-background !py-2.5 !px-4',
			component: OrderTabSelection,
			showBottomNavigation: true,
			layoutType: 'TWO_COLUMN_RIGHT_LARGE',
			showFaqIcon: true,
			faqParams,
			onClickFaqsIcon
		},
		api: {
			getOrdersData: hydrate ? getOrdersData() : await getOrdersData()
		}
	};
}) satisfies PageLoad;
