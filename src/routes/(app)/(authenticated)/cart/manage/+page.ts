import { browser } from '$app/environment';
import { getCartData } from '$lib/services/getCartData';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, depends }) => {
	const cartData = async () => {
		const cartItems = await getCartData(false, fetch);
		return cartItems;
	};

	depends('app:cartdata');
	return {
		api: {
			cartItems: browser ? cartData() : await cartData()
		},
		layoutConfig: {
			title: 'Manage Cart',
			showBackIcon: true,
			layoutType: 'DEFAULT'
		}
	};
}) satisfies PageLoad;
