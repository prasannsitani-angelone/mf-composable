import { redirect } from '@sveltejs/kit';
import type { LayoutData } from '../$types';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
import logger from '$lib/utils/logger';

export const load = (async ({ url, parent }) => {
	const parentData = await parent();
	const { pathname } = url;
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
	if (!parentData?.tokenObj?.userToken?.NTAccessToken) {
		const redirectPath = `${parentData.scheme}://${parentData.host}${pathname}`;
		if (redirectPath) {
			const withRedirectParam = `${getNavigationBaseUrl(
				'',
				parentData.scheme,
				parentData.host
			)}/login?redirect=${redirectPath}`;
			if (browser) return await goto(withRedirectParam);
			else throw redirect(302, withRedirectParam);
		} else {
			const withOutRedirectParam = `${getNavigationBaseUrl(
				'',
				parentData.scheme,
				parentData.host
			)}/login`;
			if (browser) return await goto(withOutRedirectParam);
			else throw redirect(302, withOutRedirectParam);
		}
	}
}) satisfies LayoutData;
