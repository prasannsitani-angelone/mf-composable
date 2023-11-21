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
			if (browser) {
				tokenStore.updateStore({
					state: AUTH_STATE_ENUM.LOGGED_OUT
				});
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
