import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
import { setUserTokenInCookie } from './helpers/token';
import logger from './logger';

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
			logger.info({
				type: 'Refreshing Token through spark successful'
			});
		} else {
			tokenStore.updateStore({
				state: AUTH_STATE_ENUM.LOGGED_OUT
			});
			logger.info({
				type: 'Refreshing Token through spark failed'
			});
		}
	};
};

export const registerNativeClosePopUpWindowCallback = (callback: () => void) => {
	window.closePopUpWindow = () => {
		callback();
	};
};
