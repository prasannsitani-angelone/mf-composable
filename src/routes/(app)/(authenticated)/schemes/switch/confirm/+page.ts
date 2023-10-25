import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { decodeToObject } from '$lib/utils/helpers/params';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ url, parent }) => {
	const parentData = await parent();
	const { pathname, search } = url;
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params || undefined);
	const {
		folioListLength,
		numberOfUnits,
		amount,
		selectedFolio,
		folioHolding,
		switchInFund,
		fullAmountSelected,
		appsource,
		requestId,
		interAmcFlag,
		bankAccountNo,
		bankName,
		mandateDetails
	} = decodedParams;
	if (!parentData?.tokenObj?.userToken?.NTAccessToken && pathname) {
		const withRedirectParam = `${base}/login?redirect=${encodeURIComponent(pathname + search)}`;
		if (browser) return await goto(withRedirectParam);
		else throw redirect(302, withRedirectParam);
	}
	return {
		layoutConfig: {
			title: 'Confirm Switch',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		},
		folioListLength,
		numberOfUnits,
		amount,
		selectedFolio,
		folioHolding,
		switchInFund,
		fullAmountSelected,
		appsource,
		requestId,
		interAmcFlag,
		bankAccountNo,
		bankName,
		mandateDetails
	};
}) satisfies PageLoad;
