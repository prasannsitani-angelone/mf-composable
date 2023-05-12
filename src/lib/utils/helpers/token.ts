import { decompressSync, zlibSync, strToU8 } from 'fflate';
import { isDevMode } from './dev';
import { setCookie } from './cookie';
import { PUBLIC_ENV_NAME, PUBLIC_APP_USER_COOKIE } from '$env/static/public';

export const getUserCookieName = (): string => {
	return PUBLIC_APP_USER_COOKIE;
};

export const getUserCookieOptions = () => {
	const options = {
		secure: isDevMode() ? false : true,
		sameSite: 'strict',
		path: '/'
	};
	if (!isDevMode() && PUBLIC_ENV_NAME === 'prod') {
		options.domain = '.angelone.in';
	}
	return options;
};

export function fnDecompressData(b64Data: string, rettype?: string) {
	if (!b64Data) return {};
	// Decode base64 (convert ascii to binary)
	const strData = atob(b64Data);
	// Convert binary string to character-number array
	const charData = strData.split('').map(function (x) {
		return x.charCodeAt(0);
	});

	// Turn number array into byte-array
	const binData = new Uint8Array(charData);
	// fflate magic
	try {
		const data = decompressSync(binData);
		const response = data.reduce(function (data, byte) {
			return data + String.fromCharCode(byte);
		}, '');
		if (rettype) return response;
		else return JSON.parse(response);
	} catch (error) {
		console.log('error', error);
		return {};
	}
}

function _arrayBufferToBase64(bytes) {
	let binary = '';
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

export function fnCompressData(str: string) {
	if (!str) return;
	const compressed = zlibSync(strToU8(str));
	const cs = _arrayBufferToBase64(compressed);
	return cs;
}

export const decryptToken = (token: string | null) => {
	if (token) {
		return fnDecompressData(token);
	}
	return null;
};

export const encryptToken = (token: object | null) => {
	if (token) {
		return fnCompressData(JSON.stringify(token));
	}
	return null;
};

export const setUserTokenInCookie = (token: object) => {
	const encryptedToken = encryptToken(token);
	if (encryptedToken) {
		setCookie(getUserCookieName(), encryptedToken, getUserCookieOptions());
	}
};

export const getUserTokenFromCookie = (cookie: string | undefined) => {
	if (cookie) {
		return decryptToken(cookie);
	}
	return null;
};

export const decodeToken = (token: string) => {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} catch (err) {
		return {};
	}
};

export const getTokenExpiryTime = (token: string) => {
	return decodeToken(token)?.exp;
};

export const isTokenExpired = (token = '') => {
	if (!token) {
		return false;
	}
	const currentTime = Math.ceil(Date.now() / 1000); // Date.now gives in ms hence converting to seconds
	const expTime = getTokenExpiryTime(token);
	if (expTime && expTime < currentTime) {
		return true;
	}
	return false;
};
