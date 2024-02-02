import type { OrderSummaryStoreTypes } from '$lib/types/IOrderSummaryTypes';
import { writable } from 'svelte/store';

const initalStore: OrderSummaryStoreTypes = {
	visitedOrders: []
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let orderSummaryStore: OrderSummaryStoreTypes;

	subscribe((v) => {
		orderSummaryStore = v;
	});

	return {
		subscribe,
		updateStore: (newStore: OrderSummaryStoreTypes) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		set: (store: OrderSummaryStoreTypes) => set(store),
		getVisitedOrders: () => orderSummaryStore?.visitedOrders || [],
		isOrderVisited: (orderId: number) =>
			(orderSummaryStore?.visitedOrders || [])?.findIndex((item) => item === orderId) > -1
				? true
				: false
	};
}

export const orderSummaryStore = CreateStore();
