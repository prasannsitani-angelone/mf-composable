import { goto, invalidateAll } from '$app/navigation';
import { base } from '$app/paths';
import { PUBLIC_EXTERNAL_LOGIN_ACTIVE } from '$env/static/public';
import { appStore } from '$lib/stores/SparkStore';
import { deleteCompleteCache } from '../cache';
import logger from '../logger';
import { deleteCookie } from './cookie';
import { isDevMode } from './dev';
import { getUserCookieName, getUserCookieOptions } from './token';

export const logout = async (redirectUrl: string, origin: string) => {
	deleteCompleteCache();
	deleteCookie(getUserCookieName(), getUserCookieOptions());
	try {
		await invalidateAll();
	} catch (e) {
		logger.error({ type: 'logout invalidateAll error', params: e });
	}
	await goto(getLogoutUrl(redirectUrl, origin), {
		replaceState: true
	});
};

export const getLogoutUrl = (redirectUrl: string, origin: string) => {
	if (
		!isDevMode() &&
		PUBLIC_EXTERNAL_LOGIN_ACTIVE === 'true' &&
		!appStore.isAngelBeeAndroidUser() &&
		!appStore.isAngelBeeIosUser()
	) {
		return `${origin}/login/?redirectUrl=${redirectUrl}`;
	}

	return `${base}/login?redirect=${redirectUrl}`;
};
