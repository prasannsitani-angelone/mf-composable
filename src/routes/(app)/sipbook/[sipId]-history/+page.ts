import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { ISip } from '$lib/types/ISipType';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${params?.sipId}`;
	let sipData: ISip;
	const getSipData = async () => {
		const res = await useFetch(sipUrl + '?history=true', {}, fetch);
		if (res.ok) {
			return res?.data?.data;
		}
		return sipData;
	};

	return {
		layoutConfig: {
			title: 'SIP History',
			showBackIcon: true
		},
		api: {
			getSipData: browser ? getSipData() : await getSipData()
		}
	};
}) satisfies PageLoad;
