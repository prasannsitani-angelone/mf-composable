import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const handleCartNegativeScenarios = async () => {
	if (browser) {
		await goto(`${base}/cart/empty`, { replaceState: true });
	} else {
		throw redirect(302, `${base}/cart/empty`);
	}
};
export const load = (async ({ fetch }) => {
	const getCartData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items`;
		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			const cartItems = res.data;

			if (cartItems && Array.isArray(cartItems.data) && cartItems.data.length === 0) {
				handleCartNegativeScenarios();
			}
			return {
				...cartItems
			};
		} else {
			handleCartNegativeScenarios();
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
			showBackIcon: true,
			layoutType: 'DEFAULT',
			showBottomNavigation: true
		}
	};
}) satisfies PageLoad;
