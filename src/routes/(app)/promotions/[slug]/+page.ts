import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import { getNameFromDashedParams } from '$lib/utils';
import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url, params }) => {
	const pageID = url.searchParams.get('id');
	const getPromotionalSchemes = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes?amcAd=true&id=${pageID}`;
		let searchOption: ExploreFundsOptions[] = [];
		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			searchOption = res.data;
		}

		return searchOption;
	};
	return {
		api: {
			promotions: browser ? getPromotionalSchemes() : await getPromotionalSchemes()
		},
		layoutConfig: {
			title: getNameFromDashedParams(params.slug || ''),
			showBackIcon: true,
			layoutType: 'DEFAULT'
		},
		pageID
	};
}) satisfies PageLoad;
