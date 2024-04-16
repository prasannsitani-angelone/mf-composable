import { writable } from 'svelte/store';

export interface BroswerHistory {
	isLoaded?: boolean;
	historyLength?: number | string;
	initialUrl?: string;
}

const initalStore: BroswerHistory = {
	isLoaded: false,
	historyLength: '',
	initialUrl: ''
};

function CreateStore() {
	const { subscribe, update } = writable(initalStore);
	let store = initalStore;
	subscribe((v) => {
		store = {
			...store,
			...v
		};
	});
	return {
		subscribe,
		updateStore: (newStore: BroswerHistory) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		get: () => store
	};
}

export const browserHistoryStore = CreateStore();
