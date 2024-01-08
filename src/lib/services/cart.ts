import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';

export const updateCartItem = async (param: number | string, payload) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items/${param}`;
	const res = await useFetch(
		url,
		{
			body: JSON.stringify(payload),
			method: 'PATCH'
		},
		fetch
	);

	if (res?.ok || res?.status < 500) {
		return res;
	} else {
		return new Error('Something went wrong');
	}
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

	if (res?.ok || res?.status < 500) {
		return res;
	} else {
		return new Error('Something went wrong');
	}
};
