import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import { hydrate } from '$lib/utils/helpers/hydrated';

export const load = async ({ fetch, url }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params);
	const { orderID, sipID, firstTimePayment } = decodedParams;
	const getOrderDetailsFunc = async () => {
		if (firstTimePayment) {
			return useFetch(`${PUBLIC_MF_CORE_BASE_URL}/orders/${orderID}?statusHistory=true`, {}, fetch);
		}
	};

	const getSIPDetailsFunc = async () => {
		if (sipID) {
			return useFetch(`${PUBLIC_MF_CORE_BASE_URL}/sips/${sipID}`, {}, fetch);
		}
	};

	const getAPIData = async () => {
		const response = await Promise.all([getSIPDetailsFunc(), getOrderDetailsFunc()]);
		return {
			sipData: response[0],
			ordersData: response[1]
		};
	};

	return {
		api: hydrate ? getAPIData() : await getAPIData(),
		layoutConfig: {
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			title: 'Order Summary'
		}
	};
};
