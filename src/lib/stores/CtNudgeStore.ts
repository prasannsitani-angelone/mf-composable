import { writable } from 'svelte/store';

import type { ClevertapEvent } from '$lib/types/IctTrackExternalInvestmentsStoreStore';

const initalStore: ClevertapEvent = {
	kv: {
		topic: '',
		subtext: '',
		ctatext: '',
		title: '',
		ctaurl: '',
		secondarytext: ''
	}
};

function CreateStore() {
	const { subscribe, set } = writable(initalStore);

	return {
		subscribe,
		set: (store: ClevertapEvent) => {
			set(store);
		}
	};
}

export const ctNudgeStore = CreateStore();
