import { getPendingActionsData } from '$lib/api/actions';
import type { INotification } from '$lib/types/INotifications';
import { writable } from 'svelte/store';

const initialStore: INotification = {
	instalmentFailedOrders: [],
	paymentFailedOrders: [],
	instalmentPending: []
};

function CreateStore() {
	const { subscribe, set } = writable(initialStore);
	let notifications: INotification | null;
	subscribe((v) => {
		notifications = {
			...v
		};
	});
	return {
		subscribe,
		getNotifications: () => notifications,
		set: (store: INotification) => set(store),
		fetchNewNotifications: async (isGuest = false) => {
			const notifications = await getPendingActionsData(isGuest);
			if (notifications) {
				set(notifications);
			}
		}
	};
}

const NotificationsStore = CreateStore();
export default NotificationsStore;
