// import { browser } from '$app/environment';
// import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
// import { profileStore } from '$lib/stores/ProfileStore';
// import { tokenStore } from '$lib/stores/TokenStore';
// import { MFCommonHeader } from '$lib/utils';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	// const headers = MFCommonHeader();
	// const getSchemeData = async () => {
	// 	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard?options=true`;

	// 	const res = await fetch(url, {
	// 		headers
	// 	});
	// 	if (res.ok) {
	// 		const discoverFundData = await res.json();
	// 		return {
	// 			...discoverFundData
	// 		};
	// 	} else {
	// 		return {};
	// 	}
	// };

	return {
		layoutConfig: {
			layoutClass: 'w-full xl:w-4/5'
		}
	};
}) satisfies PageLoad;
