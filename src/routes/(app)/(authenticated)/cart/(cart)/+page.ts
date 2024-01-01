import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getCartData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items`;
		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			const cartItems = res.data;
			return {
				...cartItems
			};
		} else if (res?.status < 500) {
			return {
				data: []
			};
		} else {
			return new Error('Something Went Wrong');
		}
	};
	return {
		api: {
			cart: browser ? getCartData() : await getCartData()
		},
		layoutConfig: {
			title: 'Your Cart',
			layoutType: 'DEFAULT',
			layoutClass: 'pt-0 md:pt-2 relative',
			titleClass: '!text-xl',
			headerClass: '!bg-grey !py-2.5 !px-4 !shadow-none',
			showBottomNavigation: true
		}
	};
}) satisfies PageLoad;
