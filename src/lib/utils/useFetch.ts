import { browser } from '$app/environment';
import { profileStore } from '$lib/stores/ProfileStore';
import { appStore } from '$lib/stores/SparkStore';
import { tokenStore } from '$lib/stores/TokenStore';
import { userStore } from '$lib/stores/UserStore';
import { v4 as uuidv4 } from 'uuid';
import { hydrate } from './helpers/hydrated';

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
		config.headers['X-Request-Id'] = uuidv4();
		const response = await originalFetch(resource, config);

		// response interceptor here
		return response;
	};
}

export const useFetch = (url: string, options: RequestInit = {}, fetchServer: any = null) => {
	const baseFetch = hydrate ? fetch : fetchServer;
	return baseFetch(url, {
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions?.headers,
			'X-Platform': appStore.platform(),
			authorization: `Bearer ${tokenStore.activeToken()}`,
			userType: `${userStore.userType()}`,
			accountType: `${profileStore.accountType()}`,
			...options?.headers
		}
	});
};
