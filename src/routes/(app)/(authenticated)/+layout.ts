import { redirect } from '@sveltejs/kit';
import type { LayoutData } from '../$types';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import logger from '$lib/utils/logger';
import { getLogoutUrl } from '$lib/utils/helpers/logout';
import { base } from '$app/paths';
import { modifiedGoto } from '$lib/utils/goto';

const allowedRoutes = ['search', 'discoverfunds', 'schemes', 'filter', 'nfo', 'sipbook'];

export const load = (async ({ url, parent }) => {
	const parentData = await parent();
	const { pathname, search, searchParams } = url;
	const { sparkHeaders } = parentData;

	logger.debug({
		type: 'Page Load Url',
		params: {
			response: {
				scheme: parentData.scheme,
				host: parentData.host,
				pathname
			}
		}
	});

	if (
		sparkHeaders.guest?.toLowerCase() === 'yes' &&
		(allowedRoutes.filter((route) => pathname.indexOf(route) > -1)?.length === 0 ||
			searchParams.get('orderpad') === 'INVEST')
	) {
		const url = `${base}/incomplete-kyc`;
		if (browser) return await modifiedGoto(url);
		else redirect(302, url);
	} else if (!parentData?.tokenObj?.userToken?.NTAccessToken) {
		const origin = `${parentData.scheme}//${parentData.host}`;
		const redirectUrl = `${origin}${pathname}${search}`;
		const logoutUrl = getLogoutUrl(redirectUrl, origin);
		if (browser) return await goto(logoutUrl);
		else redirect(302, logoutUrl);
	}
}) satisfies LayoutData;
