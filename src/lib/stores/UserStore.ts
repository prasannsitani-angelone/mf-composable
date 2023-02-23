import type { User } from '$lib/types/IUserType';
import { writable } from 'svelte/store';

const initalStore: User = {
	userType: '',
	arn: '',
	euin: '',
	isARNExpired: '',
	subBrokerTag: ''
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let userType: string;
	subscribe((v) => {
		userType = v.userType || '';
	});
	return {
		subscribe,
		updateStore: (newStore: User) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		set: (store: User) => set(store),
		userType: () => userType || 'B2C'
	};
}

export const userStore = CreateStore();
