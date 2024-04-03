import { writable } from 'svelte/store';

interface IBottomTab {
	clicked: boolean;
}

const initalStore: IBottomTab = {
	clicked: false
};

function CreateStore() {
	const { subscribe, update } = writable(initalStore);
	return {
		subscribe,
		bottomTabClicked: () =>
			update((s) => {
				return {
					...s,
					clicked: true
				};
			}),
		resetStore: () =>
			update((s) => {
				return {
					...s,
					clicked: false
				};
			})
	};
}

export const bottomTabStore = CreateStore();
