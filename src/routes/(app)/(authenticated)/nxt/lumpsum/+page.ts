import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ url, fetch, parent }) => {
	const parentData = await parent();

	const params = url.searchParams.get('params');
	const requestId = url.searchParams.get('requestId');
	const decodedParams = decodeToObject(params || undefined);
	let { schemeDetails } = decodedParams;
	const { mandateDetails, clientDetails, orderDetails } = decodedParams;

	const accountType = () => {
		if (!clientDetails?.clientCode) {
			return 'D';
		}
		return parentData?.profile?.dpNumber ? 'D' : 'P';
	};

	const getSchemeData = async (): Promise<SchemeDetails> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${schemeDetails?.isin}/${schemeDetails?.schemeCode}`;
		const res = await useFetch(
			url,
			{
				// This is getting called before we are setting up STORES in OnMount in layout
				headers: {
					userType: parentData?.userDetails?.userType,
					accountType: accountType()
				}
			},
			fetch
		);

		if (res.ok) {
			schemeDetails = res.data;
		} else {
			if (browser) {
				goto(`${base}/schemes/error`, { replaceState: true });
			} else {
				redirect(302, `${base}/schemes/error`);
			}
		}

		return schemeDetails;
	};
	return {
		layoutConfig: {
			layoutType: 'FULL_WIDTH',
			layoutBodyClass: 'h-full !max-w-full'
		},
		clientDetails,
		orderDetails,
		mandateDetails,
		requestId,
		api: {
			schemeDetails: browser ? getSchemeData() : await getSchemeData()
		}
	};
}) satisfies PageLoad;
