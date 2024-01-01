import { writable } from 'svelte/store';
import type { ToastItem } from '$lib/types/IToast';

interface IToastStore {
	toastQueue: ToastItem[] | [];
	statusToast?: ToastItem | null;
}

const initalStore: IToastStore = {
	toastQueue: [],
	statusToast: null
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	return {
		subscribe,
		updateToastQueue: (item: ToastItem) => {
			if (!item) {
				return;
			}
			return update((prev: IToastStore) => {
				return {
					...prev,
					toastQueue: [...prev.toastQueue, item]
				};
			});
		},
		updateStatusToast: (item: ToastItem | null) => {
			return update((prev: IToastStore) => {
				return {
					...prev,
					statusToast: item
				};
			});
		},
		reset: () => set({ toastQueue: [] }),
		set: (store: IToastStore) => set(store)
	};
}

export const toastStore = CreateStore();
