import getactiveNfo from '$lib/api/nfo';
import type { NFOList } from '$lib/types/INFOList';
import { hydrate } from '$lib/utils/helpers/hydrated';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const activeNfo = async () => {
		const NfoList: NFOList[] = await getactiveNfo(fetch);

		return NfoList;
	};

	return {
		api: {
			nfo: hydrate ? activeNfo() : await activeNfo()
		},
		layoutConfig: {
			title: 'NFO',
			showBackIcon: true,
			layoutType: 'DEFAULT'
		}
	};
}) satisfies PageLoad;
