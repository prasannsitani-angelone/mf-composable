import type { IUserDetails } from '$lib/types/IUserDetails';
import { writable } from 'svelte/store';

const initalStore: IUserDetails = {
	userType: 'B2C',
	arn: '',
	euin: '',
	isARNExpired: '',
	subBrokerTag: '',
	panSeeded: true
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let userType: string;
	subscribe((v) => {
		userType = v.userType || '';
	});
	return {
		subscribe,
		updateStore: (newStore: IUserDetails) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		set: (store: IUserDetails) => set(store),
		userType: () => userType || 'B2C'
	};
}

export const userStore = CreateStore();
