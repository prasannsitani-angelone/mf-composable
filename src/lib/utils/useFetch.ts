import { PUBLIC_SGB_CORE_BASE_URL } from '$env/static/public';

const defaultOptions = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		'X-Source': 'sovereign-gold-bonds',
		'x-requestid': 'ansk'
	}
};

export const useFetch = (url: string, options: RequestInit = {}) => {
	return fetch(PUBLIC_SGB_CORE_BASE_URL + url, {
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions?.headers,
			...options?.headers
		}
	});
};
