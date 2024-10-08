import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { decodeToObject } from '$lib/utils/helpers/params';
import { useFetch } from '$lib/utils/useFetch';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ url, parent }) => {
	const parentData = await parent();

	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params || undefined);
	const { clientDetials, orderDetails } = decodedParams;
	const { isin, schemeCode, schemePlan } = orderDetails;

	if (clientDetials?.clientCode && clientDetials?.clientCode !== parentData?.profile?.clientId) {
		if (browser) {
			goto(`${base}/schemes/clientError`, { replaceState: true });
		} else {
			redirect(302, `${base}/schemes/clientError`);
		}
	}

	const accountType = () => {
		if (!clientDetials?.clientCode) {
			return 'D';
		}
		return parentData?.profile?.dpNumber ? 'D' : 'P';
	};

	const getSchemeData = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		return useFetch(
			url,
			{
				// This is getting called before we are setting up STORES in OnMount in layout
				headers: {
					userType: schemePlan?.toUpperCase() === 'DIRECT' ? 'B2C' : 'B2B',
					accountType: accountType()
				}
			},
			fetch
		);
	};

	const getHoldingsData = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}`;
		return useFetch(
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
	};

	const getPageData = async () => {
		try {
			const res = await Promise.all([getHoldingsData(), getSchemeData()]);
			return {
				holdingsData: res[0].ok ? res[0]?.data || {} : {},
				schemeData: res[1].ok ? res[1]?.data || {} : {}
			};
		} catch (e) {
			console.log('the errorrrrrr -- ', e);
		}
	};

	return {
		api: {
			allResponse: browser ? getPageData() : await getPageData()
		},
		layoutConfig: {
			showBackIcon: false,
			layoutType: 'FULL_WIDTH',
			layoutBodyClass: 'h-full !max-w-full'
		},
		decodedParams
	};
}) satisfies PageLoad;
