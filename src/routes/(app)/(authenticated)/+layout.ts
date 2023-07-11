import { redirect } from '@sveltejs/kit';
import type { LayoutData } from '../$types';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import logger from '$lib/utils/logger';
import { base } from '$app/paths';

export const load = (async ({ url, parent }) => {
	const parentData = await parent();
	const { pathname, search } = url;
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
		if (pathname) {
			const withRedirectParam = `${base}/login?redirect=${encodeURIComponent(pathname + search)}`;
			if (browser) return await goto(withRedirectParam);
			else throw redirect(302, withRedirectParam);
		} else {
			const withOutRedirectParam = `${base}/login`;
			if (browser) return await goto(withOutRedirectParam);
			else throw redirect(302, withOutRedirectParam);
		}
	}
}) satisfies LayoutData;
