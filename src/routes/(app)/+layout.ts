import { browser } from "$app/environment";
import { userStore } from "$lib/stores/UserStore";
import type { PageLoad } from './$types';

export const load = (async ({ data }) => {
  const { userDetails } = data
  if(browser) {
		userStore.updateStore({ ...userDetails });
	}
	return {
		...data,
	};
}) satisfies PageLoad;