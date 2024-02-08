import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
import { setUserTokenInCookie } from './helpers/token';

export const registerRefreshTokenCallback = () => {
	window.refreshTokenCallback = (token: string, refreshToken: string) => {
		if (token) {
			const userToken = {
				NTAccessToken: token,
				NTRefreshToken: refreshToken
			};
			setUserTokenInCookie(userToken);
			tokenStore.updateStore({
				state: AUTH_STATE_ENUM.LOGGED_IN,
				userToken
			});
		} else {
			tokenStore.updateStore({
				state: AUTH_STATE_ENUM.LOGGED_OUT
			});
		}
	};
};
