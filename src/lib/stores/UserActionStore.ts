import { writable } from 'svelte/store';

interface IUserAction {
	userActionVisible: boolean;
}

const initalStore: IUserAction = {
	userActionVisible: false
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	return {
		subscribe,
		showUserActionDropDown: () =>
			update((v) => {
				return { ...v, userActionVisible: true };
			}),
		hideUserActionDropDown: () =>
			update((v) => {
				return { ...v, userActionVisible: false };
			}),
		set: (store: IUserAction) => set(store)
	};
}

export const userActionStore = CreateStore();
