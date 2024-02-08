import { browser } from '$app/environment';
import { userStore } from '$lib/stores/UserStore';
import { profileStore } from '$lib/stores/ProfileStore';
import { appStore } from '$lib/stores/SparkStore';
import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
import { v4 as uuidv4 } from 'uuid';
import { hydrate } from './helpers/hydrated';
import Logger from '$lib/utils/logger';
import type { FetchType } from '$lib/types/Fetch';
import { removeAuthHeaders } from './helpers/logging';
import { callNativeMethod, checkNativeMethodExist } from './callNativeMethod';
import { isTokenUpdated, setUserTokenInCookie } from './helpers/token';

let refreshingToken = false;

const callRefreshTokenMethod = async (refreshToken: string) => {
	const res = await useFetch('api/refreshToken', {
		method: 'POST',
		body: JSON.stringify({
			refresh_token: refreshToken
		}),
		headers: {
			'X-Source': 'mutualfund'
		}
	});
	if (res?.ok) {
		const userToken = {
			NTAccessToken: res?.data?.data?.access_token,
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

const getLogType = (method = '') => {
	if (method === 'POST' || method === 'PATCH' || method === 'DELETE') {
		return 'transaction';
	}
	return 'application';
};

const defaultOptions = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		'X-Source': 'mutualfunds',
		'content-type': 'application/json'
	}
};

if (browser) {
	const { fetch: originalFetch } = window;
	window.fetch = async (...args) => {
		const [resource, config] = args;

		// request interceptor starts
		// request interceptor ends
		config.headers['X-Request-Id'] = config.headers['X-Request-Id'] || uuidv4();
		// logging request
		if (!resource.toString().includes('logging')) {
			Logger.debug({
				type: 'Network request',
				params: {
					url: resource,
					opts: {
						...config,
						headers: removeAuthHeaders(config.headers)
					}
				}
			});
		}

		const response = await originalFetch(resource, config);

		// response interceptor here
		return response;
	};
}

export const useFetch = async (
	url: string,
	options: RequestInit = {},
	fetchServer?: FetchType,
	isNonJsonFetch = false,
	// Api timeput of 15second for Browser and 5second for Server
	timeout = browser ? 60000 : 5000
) => {
	const baseFetch = fetchServer || fetch;
	const opts = {
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions?.headers,
			'X-Platform': `${appStore.platform()}_${appStore.platformvariant()}`,
			authorization: `Bearer ${tokenStore.activeToken()}`,
			userType: userStore.userType(),
			accountType: `${profileStore.accountType()}`,
			...options?.headers
		}
	};
	try {
		Logger.debug({
			type: 'Making an API call',
			params: {
				url,
				fetchServerExist: !!fetchServer,
				fetch: !!fetch,
				hydrate,
				browser
			}
		});
		if (AbortSignal?.timeout) {
			opts.signal = AbortSignal.timeout(timeout);
		}
		const res = await baseFetch(url, opts);
		let data = res;
		if (!isNonJsonFetch) {
			data = await res.json();
		}
		const params = {
			url,
			opts: {
				...opts,
				headers: removeAuthHeaders(opts.headers)
			},
			response: data,
			statusCode: res.status
		};

		if (res.ok) {
			Logger.debug({
				log_type: getLogType(opts.method),
				type: 'Network Response Success',
				params
			});
		} else if (res.status === 401) {
			Logger.error({
				log_type: getLogType(opts.method),
				type: 'Token Expired',
				params
			});
			if (browser && checkNativeMethodExist('refreshToken') && !refreshingToken) {
				refreshingToken = true;
				tokenStore.updateStore({
					state: AUTH_STATE_ENUM.REFRESHING_TOKEN
				});
				callNativeMethod('refreshToken', '');
				await isTokenUpdated();
				refreshingToken = false;
				if (tokenStore.state() === AUTH_STATE_ENUM.LOGGED_IN) {
					return await useFetch(url, options, fetchServer, isNonJsonFetch, timeout);
				}
			} else if (browser && !checkNativeMethodExist('refreshToken') && !refreshingToken) {
				refreshingToken = true;
				tokenStore.updateStore({
					state: AUTH_STATE_ENUM.REFRESHING_TOKEN
				});
				callRefreshTokenMethod(tokenStore.refreshToken());
				await isTokenUpdated();
				refreshingToken = false;
				if (tokenStore.state() === AUTH_STATE_ENUM.LOGGED_IN) {
					return await useFetch(url, options, fetchServer, isNonJsonFetch, timeout);
				}
			} else if (browser && refreshingToken) {
				await isTokenUpdated();
				refreshingToken = false;
				if (tokenStore.state() === AUTH_STATE_ENUM.LOGGED_IN) {
					return await useFetch(url, options, fetchServer, isNonJsonFetch, timeout);
				}
			}
		} else {
			Logger.error({
				log_type: getLogType(opts.method),
				type: 'Network Response Error',
				params
			});
		}
		return !isNonJsonFetch ? { ok: res.ok, status: res.status, data } : res;
	} catch (e) {
		Logger.error({
			log_type: getLogType(opts.method),
			type: 'Network Request Error',
			params: {
				url,
				opts: {
					...opts,
					headers: removeAuthHeaders(opts.headers)
				},
				error: e.toString()
			}
		});
		return {};
	}
};
