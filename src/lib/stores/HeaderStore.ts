import { writable } from 'svelte/store';
import type { Header } from '$lib/types/IHeaderType';

const initalStore: Header = {
	showMobileHeader: true
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	const headerData: Header = initalStore;
	subscribe((val) => {
		if (val.showMobileHeader !== undefined) {
			headerData.showMobileHeader = val.showMobileHeader;
		}
	});
	return {
		subscribe,
		updateStore: (newStore: Header) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		set: (store: Header) => set(store),
		showMobileHeader: () => headerData?.showMobileHeader
	};
}

export const headerStore = CreateStore();
