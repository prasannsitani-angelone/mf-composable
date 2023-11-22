import { writable } from 'svelte/store';

interface ISipBook {
	showdropdown: boolean;
}

const initalStore: ISipBook = {
	showdropdown: false
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let showdropdown: boolean;
	subscribe((v) => {
		showdropdown = v.showdropdown;
	});
	return {
		subscribe,
		updateStore: (updateValue: ISipBook) =>
			update((v) => {
				return { ...v, ...updateValue };
			}),
		set: (store: ISipBook) => set(store),
		showdropdown: () => showdropdown
	};
}

export const sipBookStore = CreateStore();
