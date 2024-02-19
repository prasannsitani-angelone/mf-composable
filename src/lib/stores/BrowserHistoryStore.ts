import { writable } from 'svelte/store';

export interface BroswerHistory {
	historyLength?: number | string;
	initialUrl?: string;
}

const initalStore: BroswerHistory = {
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
		}
	};
}

export const browserHistoryStore = CreateStore();
