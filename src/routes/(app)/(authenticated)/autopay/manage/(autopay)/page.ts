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
		} else {
			return {
				data: []
			};
		}
	};
	return {
		api: {
			cart: browser ? getCartData() : await getCartData()
		},
		layoutConfig: {
			title: 'Cart',
			layoutType: 'DEFAULT',
			layoutClass: 'pt-0 md:pt-2',
			titleClass: '!text-xl',
			headerClass: '!bg-background !py-2.5 !px-4 !shadow-none',
			showBottomNavigation: true
		}
	};
}) satisfies PageLoad;
