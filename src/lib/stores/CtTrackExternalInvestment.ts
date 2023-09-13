import { writable } from 'svelte/store';

import type { IctTrackExternalInvestmentsStoreStore } from '$lib/types/IctTrackExternalInvestmentsStoreStore';

const initalStore: IctTrackExternalInvestmentsStoreStore = {
	topic: '',
	subtext: '',
	ctatext: ''
};

function CreateStore() {
	const { subscribe, set } = writable(initalStore);

	return {
		subscribe,
		set: (store: IctTrackExternalInvestmentsStoreStore) => {
			set(store);
		}
	};
}

export const ctTrackExternalInvestmentsStore = CreateStore();
