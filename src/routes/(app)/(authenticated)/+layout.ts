import { redirect } from '@sveltejs/kit';
import type { LayoutData } from '../$types';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import logger from '$lib/utils/logger';
import { getLogoutUrl } from '$lib/utils/helpers/logout';

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
		const logoutUrl = getLogoutUrl(url.href, url.origin);
		if (browser) return await goto(logoutUrl);
		else throw redirect(302, logoutUrl);
	}
}) satisfies LayoutData;
