import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { ISipHealth } from '$lib/types/ISipType';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	let sipHealthData: ISipHealth;

	const sipHealthUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/health`;

	const getSipHealthData = async () => {
		const res = await useFetch(sipHealthUrl, {}, fetch);

		if (
			res?.ok &&
			res?.status === 200 &&
			res?.data?.status?.toLowerCase() === 'success' &&
			res?.data?.data
		) {
			sipHealthData = res?.data?.data || {};
		}

		return sipHealthData || {};
	};

	return {
		layoutConfig: {
			layoutType: 'TWO_COLUMN',
			title: 'SIP Health Report',
			showBackIcon: true
		},
		api: {
			sipHealthData: browser ? getSipHealthData() : await getSipHealthData()
		}
	};
}) satisfies PageLoad;
