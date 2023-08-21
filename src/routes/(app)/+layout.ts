import { browser } from "$app/environment";
import { AUTH_STATE_ENUM, tokenStore } from "$lib/stores/TokenStore";
import { userStore } from "$lib/stores/UserStore"
import { isTokenExpired } from '$lib/utils/helpers/token';
import type { PageLoad } from './$types';

export const load = (async ({ data }) => {
	const { tokenObj, userDetails, isGuest } = data;

  if(browser) {
		const authState = isGuest
			? isTokenExpired(tokenObj?.guestToken)
				? AUTH_STATE_ENUM.GUEST_LOGGED_OUT
				: AUTH_STATE_ENUM.GUEST_LOGGED_IN
			: isTokenExpired(tokenObj?.userToken?.NTAccessToken)
			? AUTH_STATE_ENUM.LOGGED_OUT
			: AUTH_STATE_ENUM.LOGGED_IN;
		tokenStore.updateStore({ ...tokenObj, state: authState });
		userStore.updateStore({ ...userDetails });
	}
	return {
		...data,
	};
}) satisfies PageLoad;