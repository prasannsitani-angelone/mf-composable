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

let statusTimeout;

const updateStatusToast = () => {
	if (statusTimeout) {
		clearTimeout(statusTimeout);
	}

	statusTimeout = setTimeout(() => {
		toastStore?.updateStatusToast(null);
	}, 4000);
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
		updateStatusToast: (item: ToastItem | null, isStickyToast = false) => {
			if (!isStickyToast) {
				updateStatusToast();
			}

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
