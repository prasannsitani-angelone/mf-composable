import { redirect } from '@sveltejs/kit';
import type { LayoutData } from '../$types';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { extractRedirectUrl } from '$lib/utils/helpers/url';

export const load = (async ({ parent, url }) => {
	const { search } = url;
	const redirectUrl = extractRedirectUrl(search || '') || `${base}/discoverfunds`;
	const parentData = await parent();
	if (parentData?.isGuest === false) {
		if (browser) return await goto(redirectUrl);
		else redirect(302, redirectUrl);
	}
}) satisfies LayoutData;
