import { tokenStore } from '$lib/stores/TokenStore';
import type { WMSCookie } from '$lib/types/IWMSCookie';
import { parse } from 'cookie-es';

function setUserToken() {
	const cookie: WMSCookie = parse(document.cookie);

	tokenStore.updateStore({
		userToken: cookie['ABUserCookie'] || '',
		guestToken: cookie['ABGuestCookie'] || ''
	});
}

setUserToken();
