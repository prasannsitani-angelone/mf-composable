import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { ITaxationDetails } from '$lib/types/IInvestments';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	const taxType = <'STCG' | 'LTCG'>url?.searchParams?.get('taxType');
	const holdingType = <'EQUITY' | 'NON_EQUITY'>url.searchParams.get('holdingType');
	const isExternal = url.searchParams.get('external') || false;
	const queryParam = url?.search;

	let taxationDetails: ITaxationDetails[] = [
		{
			holdingType: 'EQUITY',
			taxType
		}
	];

	const getTaxationDetails = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/taxations/holdings${queryParam}`;
		const response = await useFetch(url, {}, fetch);

		if (response.ok) {
			taxationDetails = <ITaxationDetails[]>await response?.data?.data?.holdings;

			return taxationDetails;
		}
	};
	const title = taxType === 'STCG' ? 'Short Term Investments' : 'Long Term Investments';
	return {
		api: {
			getTaxationDetails: browser ? getTaxationDetails() : await getTaxationDetails()
		},
		taxType,
		holdingType,
		isExternal,
		title,
		layoutConfig: {
			title,
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		}
	};
}) satisfies PageLoad;
