import type { TokenStore } from '$lib/stores/TokenStore';
import type { LayoutServerLoad } from '../$types';
import type { UserProfile } from '$lib/types/IUserProfile';

import type { IUserDetails } from '$lib/types/IUserDetails';
import {
	NON_LOGGED_IN_COOKIE,
	encryptToken,
	getCookieOptions,
	getUserCookieName,
	getUserCookieOptions
} from '$lib/utils/helpers/token';

export const load = (async ({ request, locals, cookies }) => {
	const {
		isGuest,
		userDetails,
		profileData,
		token = '',
		refreshToken = '',
		shouldSetABUserCookie,
		investementSummary,
		searchDashboardData
	} = locals;

	const tokenObj: TokenStore = {
		userToken: {
			NTAccessToken: '',
			NTRefreshToken: ''
		},
		guestToken: ''
	};
	const localProfileData: UserProfile = profileData;
	const localUserDetails: IUserDetails = userDetails;

	if (isGuest) {
		tokenObj.guestToken = token;
		cookies.set(NON_LOGGED_IN_COOKIE, tokenObj.guestToken, getCookieOptions(false));
	} else {
		tokenObj.userToken = {
			NTAccessToken: token,
			NTRefreshToken: refreshToken
		};
		if (shouldSetABUserCookie) {
			cookies.set(
				getUserCookieName(),
				encryptToken(tokenObj.userToken) || '',
				getUserCookieOptions(false)
			);
		}
	}

	console.log(
		JSON.stringify({
			type: 'SSR Navigation App Level',
			params: {
				locals: {
					...locals,
					token: token ? 'xxxx' : '',
					refreshToken: refreshToken ? 'xxxx' : '',
					profileData: localProfileData
				},
				url: request?.url
			}
		})
	);
	return {
		profile: localProfileData,
		tokenObj,
		searchDashboardData,
		isGuest,
		userDetails: localUserDetails,
		investementSummary
	};
}) satisfies LayoutServerLoad;
