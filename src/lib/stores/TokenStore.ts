import { writable } from 'svelte/store';

export interface TokenStore {
	guestToken?: string;
	userToken?: string;
	sessionID?: string;
}

const initalStore: TokenStore = {
	guestToken: '',
	userToken: '',
	sessionID: ''
};
function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let guestToken: string;
	let userToken: string;
	subscribe((v) => {
		guestToken = v.guestToken || '';
		userToken = v.userToken || '';
	});
	return {
		subscribe,
		updateStore: (newStore: TokenStore) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		set: (store: TokenStore) => set(store),
		guestToken: () => guestToken,
		userToken: () => userToken,
		activeToken: () => userToken || guestToken
	};
}

export const tokenStore = CreateStore();
