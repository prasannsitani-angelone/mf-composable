import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, depends }) => {
	const getFavourites = async () => {
		let favouritesFunds: ExploreFundsOptions[] = [];
		const url = `${PUBLIC_MF_CORE_BASE_URL}/user/favourites`;

		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			favouritesFunds = res?.data?.data?.schemes;
			if (favouritesFunds.length === 0) {
				if (browser) {
					goto(`${base}/favourites/nofunds`, { replaceState: true });
				} else {
					throw redirect(302, `${base}/favourites/nofunds`);
				}
			}
		}

		return favouritesFunds;
	};

	depends('favourites');
	return {
		api: {
			favourites: hydrate ? getFavourites() : await getFavourites()
		},
		layoutConfig: {
			title: 'Favourites',
			showBackIcon: true,
			layoutType: 'DEFAULT',
			showBottomNavigation: true,
			showSearchIcon: true
		}
	};
}) satisfies PageLoad;
