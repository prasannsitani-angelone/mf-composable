import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { getCartData } from '$lib/services/getCartData';
import type { PageLoad } from './$types';
import { base } from '$app/paths';

export const load = (async ({ fetch, depends }) => {
	const cartData = async () => {
		const cartItems = await getCartData(false, fetch);
		if (cartItems.length === 0) {
			const cartUrl = `${base}/cart`;
			if (browser) return await goto(cartUrl, { replaceState: true });
		}
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
