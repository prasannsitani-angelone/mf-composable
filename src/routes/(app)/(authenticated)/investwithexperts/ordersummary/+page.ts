import { browser } from '$app/environment';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';

export const load = async ({ fetch, url }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params);
	const { bulkId } = decodedParams;

	const getOrderSummaryStatus = async () => {
		const error = {
			paymentStatus: 'failure'
		};
		try {
			const response = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/sips/bulk/${bulkId}`, fetch);
			if (response.ok) {
				return response.data.data;
			}
			return error;
		} catch (e) {
			return error;
		}
	};

	return {
		api: {
			orderStatus: browser ? getOrderSummaryStatus() : await getOrderSummaryStatus()
		},
		layoutConfig: {
			title: 'Order Summary',
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			showBackIcon: true
		}
	};
};
