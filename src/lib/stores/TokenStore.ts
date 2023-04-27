import { writable } from 'svelte/store';

export const AUTH_STATE_ENUM = {
	NON_LOGGED_IN: 'NON_LOGGED_IN',
	LOGGED_IN: 'LOGGED_IN',
	GUEST_LOGGED_IN: 'GUEST_LOGGED_IN',
	LOGGED_OUT: 'LOGGED_OUT',
	GUEST_LOGGED_OUT: 'GUEST_LOGGED_OUT'
};

export interface TokenStore {
	guestToken?: string;
	userToken?: object;
	sessionID?: string;
	state?: string;
}

const initalStore: TokenStore = {
	guestToken: '',
	userToken: {},
	sessionID: '',
	state: AUTH_STATE_ENUM.NON_LOGGED_IN
};
function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let guestToken: string;
	let userToken: object;
	let state: string;
	subscribe((v) => {
		guestToken = v.guestToken || '';
		userToken = v.userToken || '';
		state = v.state || '';
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
		state: () => state
	};
}

export const tokenStore = CreateStore();
