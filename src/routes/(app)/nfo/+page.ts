import getactiveNfo, { getClosedNfo } from '$lib/api/nfo';
import type { NFOList } from '$lib/types/INFOList';
import { hydrate } from '$lib/utils/helpers/hydrated';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const activeNfo = async () => {
		const NfoList: NFOList[] = await getactiveNfo(fetch);

		return NfoList;
	};
	const closedNfo = async () => {
		const NfoList: NFOList[] = await getClosedNfo(fetch);

		return NfoList;
	};

	return {
		api: {
			nfo: hydrate ? activeNfo() : await activeNfo(),
			closedNfo: hydrate ? closedNfo() : await closedNfo()
		},
		layoutConfig: {
			title: 'NFO',
			showBackIcon: true,
			layoutType: 'DEFAULT'
		}
	};
}) satisfies PageLoad;
