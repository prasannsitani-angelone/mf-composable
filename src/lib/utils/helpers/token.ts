import { decompressSync, zlibSync, strToU8 } from 'fflate';
import { isDevMode } from './dev';
import { setCookie } from './cookie';
import { PUBLIC_ENV_NAME, PUBLIC_APP_USER_COOKIE } from '$env/static/public';
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie-es';

export const NON_LOGGED_IN_COOKIE = 'ABNonLoggedInCookie';

export const getUserCookieName = (): string => {
	return PUBLIC_APP_USER_COOKIE;
};

export const getUserCookieOptions = (isHttpCookie = true) => {
	const options: CookieSerializeOptions = {
		secure: isDevMode() ? false : true,
		sameSite: 'strict',
		path: '/',
		httpOnly: isHttpCookie
	};
	if (!isDevMode() && PUBLIC_ENV_NAME === 'prod') {
		options.domain = '.angelone.in';
	}
	return options;
};

export const getCookieOptions = (isHttpCookie = true) => {
	const options: CookieSerializeOptions = {
		secure: isDevMode() ? false : true,
		sameSite: 'strict',
		path: '/',
		httpOnly: isHttpCookie
	};
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

function tryDecode(str, decode) {
	try {
		return decode(str);
	} catch {
		return str;
	}
}

function decode(str: string) {
	return str.includes('%') ? decodeURIComponent(str) : str;
}

function parse(str: string, options?: CookieParseOptions) {
	if (typeof str !== 'string') {
		throw new TypeError('argument str must be a string');
	}

	const arr = [];
	const opt = options || {};
	const dec = opt.decode || decode;

	let index = 0;
	while (index < str.length) {
		const eqIdx = str.indexOf('=', index);

		// no more cookie pairs
		if (eqIdx === -1) {
			break;
		}

		let endIdx = str.indexOf(';', index);

		if (endIdx === -1) {
			endIdx = str.length;
		} else if (endIdx < eqIdx) {
			// backtrack on prior semicolon
			index = str.lastIndexOf(';', eqIdx - 1) + 1;
			continue;
		}

		const key = str.slice(index, eqIdx).trim();

		// only assign once
		let val = str.slice(eqIdx + 1, endIdx).trim();

		// quoted values
		if (val.codePointAt(0) === 0x22) {
			val = val.slice(1, -1);
		}
		arr.push({
			[key]: tryDecode(val, dec)
		});

		index = endIdx + 1;
	}

	return arr;
}
export const decryptRightUserCookie = (cookiesString: string) => {
	let decryptedValue = '';
	try {
		const cookieArr = parse(cookiesString);
		for (let i = 0; i < cookieArr.length; i++) {
			const cookieName = Object.keys(cookieArr[i])[0];
			const cookieValue = cookieArr[i][cookieName];
			if (cookieName === getUserCookieName()) {
				decryptedValue = getUserTokenFromCookie(cookieValue);
				if (
					decryptedValue &&
					typeof decryptedValue === 'object' &&
					Object.keys(decryptedValue)?.length > 0
				) {
					break;
				}
			}
		}
		return decryptedValue;
	} catch (e) {
		return decryptedValue;
	}
};
