import { dev } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL_V2 } from '$env/static/public';
import cacheInmemory from '$lib/server/cache.inmemory';
import type { FetchType } from '$lib/types/Fetch';
import { useFetch } from '$lib/utils/useFetch';

export const getsearchDashboardData = async (
	token: string,
	fetch: FetchType,
	internalBaseUrl?: string,
	userType?: string
) => {
	const url = `${
		internalBaseUrl && !dev ? internalBaseUrl : PUBLIC_MF_CORE_BASE_URL_V2
	}/schemes/dashboard?options=true`;

	const cachedResponse = await cacheInmemory.get({ url, userType: userType ? userType : 'B2C' });

	if (cachedResponse) {
		return cachedResponse;
	}

	const res = await useFetch(
		url,
		{
			headers: {
				authorization: `Bearer ${token}`,
				userType: userType ? userType : 'B2C'
			}
		},
		fetch
	);

	if (res.ok) {
		const discoverFundData = res.data;
		await cacheInmemory.set({ url, userType: userType ? userType : 'B2C' }, discoverFundData);
		return {
			...discoverFundData
		};
	} else {
		return {
			categories: [],
			weeklyTopSchemes: [],
			banner: []
		};
	}
};
