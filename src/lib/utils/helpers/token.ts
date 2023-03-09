import AES from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';
import { setCookie } from './cookie';

export const decryptToken = (token: string | null, tokenEncryptionPassPhrase: string) => {
	if (token) {
		const bytes = AES.decrypt(token, tokenEncryptionPassPhrase);
		return JSON.parse(bytes.toString(utf8));
	}
	return null;
};

export const encryptToken = (token: Object | null, tokenEncryptionPassPhrase: string) => {
	if (token) {
		const result = AES.encrypt(JSON.stringify(token), tokenEncryptionPassPhrase).toString();
		return result;
	}
	return null;
};

export const setUserTokenInCookie = (token: Object) => {
	if (token) {
		const encryptedToken = encryptToken(token, '@nge|$p@rk2021');
		setCookie('ABUserCookie', encryptedToken, {
			sameSite: 'Strict',
			secure: true
		});
	}
};

export const getUserTokenFromCookie = (cookie: string | undefined) => {
	if (cookie) {
		const decryptedToken = decryptToken(cookie, '@nge|$p@rk2021');
		return decryptedToken;
	}
	return null;
};
