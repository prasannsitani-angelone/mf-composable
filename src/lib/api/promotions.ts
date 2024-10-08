import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import cacheInmemory from '$lib/server/cache.inmemory';
import type { FetchType } from '$lib/types/Fetch';
import { useFetch } from '$lib/utils/useFetch';

const getPromotionData = async (token: string, fetch?: FetchType, userType?: string) => {
	let promotionData;
	const url = `${PUBLIC_MF_CORE_BASE_URL}/promotion`;
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
		promotionData = res.data;
		await cacheInmemory.set({ url, userType: userType ? userType : 'B2C' }, promotionData);
	}
	return promotionData;
};

export { getPromotionData };
