import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { NFOList } from '$lib/types/INFOList';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getActiveNfo = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes?nfo=true`;

		let NfoList: NFOList[] = [];

		const res = await useFetch(url, {}, fetch);
		console.log(res);
		if (res.ok) {
			console.log(res);
			NfoList = res?.data;
		}

		return NfoList;
	};

	return {
		api: {
			nfo: hydrate ? getActiveNfo() : await getActiveNfo()
		},
		layoutConfig: {
			title: 'NFO',
			showBackIcon: true,
			layoutType: 'DEFAULT'
		}
	};
}) satisfies PageLoad;
