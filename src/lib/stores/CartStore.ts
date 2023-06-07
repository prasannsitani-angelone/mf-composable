import { writable } from 'svelte/store';
import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
import type { ICartStore, RemoveCartItem } from '$lib/types/ICartStore';
import { getCartData } from '$lib/services/getCartData';

const initalStore: ICartStore = {
	item: [],
	count: 0,
	repetetiveAddAttempt: false,
	removeFromCart: false,
	currentSelection: null,
	addToCartRequestedFromModal: false
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);

	const updateStore = (newItems: WeeklyTopSchemesEntity[]) => {
		return update((prev: ICartStore) => {
			return { ...prev, item: newItems, count: newItems.length };
		});
	};

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
		removeCartItems: (cartItemId: number) => {
			if (!cartItemId) {
				return;
			}
			return update((prev: ICartStore) => {
				const item = prev.item.filter((cartItem) => cartItem.cartItemId !== cartItemId);
				return {
					...prev,
					item: item,
					count: prev.count - 1
				};
			});
		},
		updateStore,
		showAddToCartPopup: (item: WeeklyTopSchemesEntity) =>
			update((v) => {
				return { ...v, repetetiveAddAttempt: true, currentSelection: item };
			}),
		showRemoveFromCartPopup: (item: WeeklyTopSchemesEntity | RemoveCartItem) => {
			update((v) => {
				return { ...v, removeFromCart: true, currentSelection: item };
			});
		},

		hideAddToCartPopup: () =>
			update((v) => {
				return { ...v, repetetiveAddAttempt: false, removeFromCart: false };
			}),
		hidePopupAndclearCurrentItemSelection: () =>
			update((v) => {
				return { ...v, repetetiveAddAttempt: false, removeFromCart: false, currentSelection: null };
			}),
		updateAddToCartRequestFromModal: () =>
			update((v) => {
				return { ...v, addToCartRequestedFromModal: !v.addToCartRequestedFromModal };
			}),
		set: (store: ICartStore) => {
			set(store);
		},
		updateCartData: async (isGuest: boolean) => {
			const cartItems = await getCartData(isGuest);
			updateStore(cartItems || []);
		}
	};
}

export const cartStore = CreateStore();
