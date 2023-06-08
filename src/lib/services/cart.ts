import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';

export const updateCartItem = async (param: number | string, payload) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items/${param}`;
	await useFetch(
		url,
		{
			body: JSON.stringify(payload),
			method: 'PATCH'
		},
		fetch
	);
};

export const bulkUpdateCartItems = async (payload) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items`;
	const res = await useFetch(
		url,
		{
			body: JSON.stringify(payload),
			method: 'PATCH'
		},
		fetch
	);
	return res;
};
