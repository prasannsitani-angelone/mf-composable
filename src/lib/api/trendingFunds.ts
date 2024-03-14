import { dev } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL_V2 } from '$env/static/public';
import cacheInmemory from '$lib/server/cache.inmemory';
import type { FetchType } from '$lib/types/Fetch';
import { TrendingFund } from '$lib/types/ITrendingFunds';
import { useFetch } from '$lib/utils/useFetch';

export const getTrendingFundsData = async (
	token: string,
	fetch: FetchType,
	internalBaseUrl?: string,
	userType?: string
) => {
	let trendingFundsData: TrendingFund[] = [];
	const url = `${
		internalBaseUrl && !dev ? internalBaseUrl : PUBLIC_MF_CORE_BASE_URL_V2
	}/schemes?mostViewed=true`;

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
		trendingFundsData = res?.data?.data;
		await cacheInmemory.set({ url, userType: userType ? userType : 'B2C' }, trendingFundsData);
	}

	return trendingFundsData;
};
