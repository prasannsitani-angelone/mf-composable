import { profileStore } from '$lib/stores/ProfileStore';
import { appStore } from '$lib/stores/SparkStore';
import { tokenStore } from '$lib/stores/TokenStore';
import { userStore } from '$lib/stores/UserStore';
import { v4 as uuidv4 } from 'uuid';

const defaultOptions = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		'X-Source': 'mutualfunds',
		'content-type': 'application/json'
	}
};

export const useFetch = (url: string, options: RequestInit = {}, fetchServer: any = null) => {
	const baseFetch = fetchServer || fetch;
	console.log(tokenStore.activeToken())
	return baseFetch(url, {
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions?.headers,
			'X-Platform': appStore.platform(),
			'X-Request-Id': uuidv4(),
			authorization: `Bearer ${tokenStore.activeToken()}`,
			userType: `${userStore.userType()}`,
			accountType: `${profileStore.accountType()}`,
			...options?.headers
		}
	});
};
