import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL, PUBLIC_MF_CORE_BASE_URL_V2 } from '$env/static/public';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	const params = url.searchParams.get('params') || undefined;
	const decodedParams = decodeToObject(params);
	const { tag, orderId, Status, showRecentOrders } = decodedParams;

	const getFAQS = async () => {
		try {
			const response = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/faqs?tag=${tag}`, {}, fetch);

			return response;
		} catch (e) {
			return {};
		}
	};

	const getOrders = async () => {
		if (showRecentOrders) {
			const ordersUrl = `${PUBLIC_MF_CORE_BASE_URL_V2}/orders`;
			const response = useFetch(ordersUrl, {}, fetch);

			return response;
		}
		return null;
	};

	return {
		api: {
			getFAQS: browser ? getFAQS() : await getFAQS(),
			getOrders: browser ? getOrders() : await getOrders()
		},
		tag: tag?.length ? tag : 'all',
		orderId,
		Status,
		showRecentOrders,
		layoutConfig: {
			title: 'FAQs',
			showBackIcon: true,
			layoutType: 'DEFAULT'
		}
	};
}) satisfies PageLoad;
