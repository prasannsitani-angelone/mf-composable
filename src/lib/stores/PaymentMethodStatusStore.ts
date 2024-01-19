import { writable } from 'svelte/store';
import type { UserPaymentMethodsData } from '$lib/types/IPayments';
import { getUserPaymentMethodsStatus } from '$components/Payment/api';

let initialStore: UserPaymentMethodsData;

export const getPaymentModeStatus = async (): Promise<UserPaymentMethodsData> => {
	const response = await getUserPaymentMethodsStatus({ source: 'mf' });
	return response?.data?.data || {};
};

function createStore() {
	const { subscribe, update } = writable(initialStore);

	let store: UserPaymentMethodsData;
	let isSet = false;
	subscribe(async (v) => {
		store = v;
	});
	function updateStore(newStore: UserPaymentMethodsData) {
		return update((s) => {
			isSet = true;
			return { ...s, ...newStore };
		});
	}

	async function initialise() {
		updateStore(await getPaymentModeStatus());
	}

	return {
		subscribe,
		updateStore,
		getData: async () => {
			if (!isSet) {
				await initialise();
			}
			store;
		},
		isSet: () => isSet
	};
}

export const paymentMethodStatusStore = createStore();
