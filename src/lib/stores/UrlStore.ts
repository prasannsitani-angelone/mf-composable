import { writable } from 'svelte/store';

interface IUrlStore {
	urlSource: '';
}

const initalStore: IUrlStore = {
	urlSource: ''
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let urlSource: string;
	subscribe((v) => {
		urlSource = v.urlSource || '';
	});
	return {
		subscribe,
		updateStore: (newStore: IUrlStore) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		urlSource: () => urlSource,
		reset: () => set({ urlSource: '' }),
		set: (store: IUrlStore) => set(store)
	};
}

export const urlStore = CreateStore();
