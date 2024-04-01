import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import cacheInmemory from '$lib/server/cache.inmemory';
import type { FetchType } from '$lib/types/Fetch';
import { useFetch } from '$lib/utils/useFetch';

const getReadyMadePortfolios = async (token: string, fetch?: FetchType, userType?: string) => {
	let portfolios;
	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/packs?packGroupId=READY_MADE_PORTFOLIO`;
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
		portfolios = res.data?.packs;
		await cacheInmemory.set({ url, userType: userType ? userType : 'B2C' }, portfolios);
	}
	return portfolios;
};

export { getReadyMadePortfolios };
