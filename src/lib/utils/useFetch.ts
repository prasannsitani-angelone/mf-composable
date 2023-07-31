import { browser } from '$app/environment';
import { userStore } from '$lib/stores/UserStore';
import { profileStore } from '$lib/stores/ProfileStore';
import { appStore } from '$lib/stores/SparkStore';
import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
import { hydrate } from './helpers/hydrated';
import Logger from '$lib/utils/logger';
import type { FetchType } from '$lib/types/Fetch';
import { removeAuthHeaders } from './helpers/logging';

const defaultOptions = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		'X-Source': 'mutualfunds',
		'content-type': 'application/json'
	}
};

export const useFetch = async (
	url: string,
	options: RequestInit = {},
	fetchServer?: FetchType,
	isNonJsonFetch = false
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
				type: 'Network Response Success',
				params
			});
		} else if (res.status === 401) {
			Logger.error({
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
				type: 'Network Response Error',
				params
			});
		}
		return !isNonJsonFetch ? { ok: res.ok, status: res.status, data } : res;
	} catch (e) {
		Logger.error({
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
