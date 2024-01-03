import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import type { INotification } from '$lib/types/INotifications';

export const load = (async ({ fetch }) => {
	let notifData: INotification | null = null;

	const getPendingActionsData = async () => {
		const notifUrl = `${PUBLIC_MF_CORE_BASE_URL}/notifications`;
		const res = await useFetch(notifUrl, {}, fetch);
		if (res.ok) {
			notifData = res?.data?.data || {};
			return notifData;
		} else if (res?.status < 500) {
			return [];
		} else {
			return new Error('Something Went Wrong');
		}
	};

	return {
		layoutConfig: {
			title: 'Pending Actions',
			headerClass: '!py-2.5 !px-4 shadow-none',
			showBottomNavigation: false,
			showFaqIcon: false,
			showBackIcon: true
		},
		notifData: notifData,
		api: {
			getPendingActionsData: browser ? getPendingActionsData() : await getPendingActionsData()
		}
	};
}) satisfies PageLoad;
