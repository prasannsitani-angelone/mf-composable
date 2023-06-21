import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
import { useFetch } from '$lib/utils/useFetch';

export const getCartData = async (isGuest: boolean, fetch?: FetchType) => {
	let cartItems: WeeklyTopSchemesEntity[] = [];
	if (isGuest) return cartItems;

	const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items`;
	const res = await useFetch(url, {}, fetch);

	if (res.ok) {
		cartItems = res.data?.data;
	}

	return cartItems;
};
