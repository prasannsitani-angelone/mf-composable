import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { OrdersSummary } from '$lib/types/IInvestments';
import type { IOrdersResponse, orderItem } from '$lib/types/IOrderItem';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	let ordersSummary: OrdersSummary;
	const ordersUrl = `${PUBLIC_MF_CORE_BASE_URL}/orders`;
	const getOrdersData = async () => {
		const ordersResponse = await useFetch(ordersUrl + '?summary=true', {}, fetch);
		if (ordersResponse.ok) {
			const responseData = ordersResponse.data;
			ordersSummary = responseData?.data?.summary;
			const promises = [];
			let inProgressOrders: orderItem[] = [];
			let failedOrders: orderItem[] = [];
			if (ordersSummary?.totalProcessingOrders) {
				promises.push(
					useFetch(ordersUrl + '?status=ORDER_PROCESSING', {}, fetch)
						.then((res) => res.data)
						.then(({ data }: { data: IOrdersResponse }) => {
							inProgressOrders = data?.orders;
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
				ordersSummary
			};
		}
		return {
			inProgressOrders: [],
			failedOrders: [],
			ordersSummary
		};
	};

	return {
		// We are uisng hydrate here, because if we use browser and  as we are awaiting for promise.allSettled the hydrate gets updated because of which we see difference in CSR and SSR so API gets called again in client side
		api: {
			getOrdersData: hydrate ? getOrdersData() : await getOrdersData()
		}
	};
}) satisfies PageLoad;
