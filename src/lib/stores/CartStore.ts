import { writable } from 'svelte/store';
import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';

interface ICartStore {
	item: WeeklyTopSchemesEntity[];
	count: number;
	repetetiveAddAttempt: boolean;
	currentSelection: WeeklyTopSchemesEntity | null;
	addToCartRequestedFromModal: boolean;
}

const initalStore: ICartStore = {
	item: [],
	count: 0,
	repetetiveAddAttempt: false,
	currentSelection: null,
	addToCartRequestedFromModal: false
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	return {
		subscribe,
		updateCartItems: (item: WeeklyTopSchemesEntity) => {
			if (!item) {
				return;
			}
			return update((prev: ICartStore) => {
				return {
					...prev,
					item: [...prev.item, item],
					count: prev.count + 1
				};
			});
		},
		updateStore: (newItems: WeeklyTopSchemesEntity[]) => {
			return update((prev: ICartStore) => {
				return { ...prev, item: newItems, count: newItems.length };
			});
		},
		showAddToCartPopup: (item: WeeklyTopSchemesEntity) =>
			update((v) => {
				return { ...v, repetetiveAddAttempt: true, currentSelection: item };
			}),
		hideAddToCartPopup: () =>
			update((v) => {
				return { ...v, repetetiveAddAttempt: false };
			}),
		hidePopupAndclearCurrentItemSelection: () =>
			update((v) => {
				return { ...v, repetetiveAddAttempt: false, currentSelection: null };
			}),
		updateAddToCartRequestFromModal: () =>
			update((v) => {
				return { ...v, addToCartRequestedFromModal: !v.addToCartRequestedFromModal };
			}),
		set: (store: ICartStore) => set(store)
	};
}

export const cartStore = CreateStore();
