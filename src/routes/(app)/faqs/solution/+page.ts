import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	const params = url.searchParams.get('params') || undefined;
	const decodedParams = decodeToObject(params);
	const { tag, selectedFaqIndex, showRecentOrders } = decodedParams;

	const getFAQS = async () => {
		try {
			const response = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/faqs?tag=${tag}`, {}, fetch);

			return response;
		} catch (e) {
			return {};
		}
	};

	return {
		api: {
			getFAQS: browser ? getFAQS() : await getFAQS()
		},
		selectedFaqIndex,
		showRecentOrders,
		layoutConfig: {
			title: 'FAQs',
			titleClass: 'invisible',
			showBackIcon: true,
			layoutType: 'DEFAULT'
		}
	};
}) satisfies PageLoad;
