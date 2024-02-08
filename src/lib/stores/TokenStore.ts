import { writable } from 'svelte/store';

export const AUTH_STATE_ENUM = {
	NON_LOGGED_IN: 'NON_LOGGED_IN',
	LOGGED_IN: 'LOGGED_IN',
	GUEST_LOGGED_IN: 'GUEST_LOGGED_IN',
	LOGGED_OUT: 'LOGGED_OUT',
	GUEST_LOGGED_OUT: 'GUEST_LOGGED_OUT',
	REFRESHING_TOKEN: 'REFRESHING_TOKEN'
};

export interface TokenStore {
	guestToken?: string;
	userToken?: object;
	sparkSessionID?: string;
	mfSessionID?: string;
	state?: string;
}

const initalStore: TokenStore = {
	guestToken: '',
	userToken: {},
	sparkSessionID: '',
	mfSessionID: '',
	state: AUTH_STATE_ENUM.NON_LOGGED_IN
};
function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let guestToken: string;
	let userToken: object;
	let state: string;
	let store: TokenStore;
	subscribe((v) => {
		guestToken = v.guestToken || '';
		userToken = v.userToken || '';
		state = v.state || '';
		store = v;
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
		accessToken: () => userToken.NTAccessToken,
		refreshToken: () => userToken.NTRefreshToken,
		activeToken: () => userToken.NTAccessToken || guestToken,
		sparkSessionID: () => store.sparkSessionID,
		mfSessionID: () => store.mfSessionID,
		state: () => state
	};
}

export const tokenStore = CreateStore();
