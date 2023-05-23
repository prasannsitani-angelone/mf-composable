import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { NFOList } from '$lib/types/INFOList';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
// const fakePromise = () => {
// 	return new Promise((resolve) => {
// 		setTimeout(() => {
// 			resolve(true);
// 		}, 10000);
// 	});
// };
export const load = (async ({ data, fetch }) => {
	const getactiveNfo = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes?nfo=true`;
		let NfoList: NFOList[] = [];

		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			NfoList = res?.data;
		}

		return NfoList;
	};

	return {
		streamed: {
			nfo: hydrate ? getactiveNfo() : await getactiveNfo()
		},
		layoutConfig: {
			title: 'Mutual Funds',
			showCloseIcon: true,
			showSearchIcon: true,
			showBottomNavigation: true,
			layoutType: 'TWO_COLUMN'
		},
		getNudgeData: data.streamed.getNudgeData
	};
}) satisfies PageLoad;
