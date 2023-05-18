import { writable } from 'svelte/store';

interface ILogoutAction {
	logoutAttempt: boolean;
}

const initalStore: ILogoutAction = {
	logoutAttempt: false
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	return {
		subscribe,
		showLogoutConfirmationPopup: () =>
			update((v) => {
				return { ...v, logoutAttempt: true };
			}),
		hideLogoutConfirmationPopup: () =>
			update((v) => {
				return { ...v, logoutAttempt: false };
			}),
		set: (store: ILogoutAction) => set(store)
	};
}

export const logoutAttemptStore = CreateStore();
