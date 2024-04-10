import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { FetchType } from '$lib/types/Fetch';

export const getPendingActionsData = async (isGuest?: boolean, fetch?: FetchType) => {
	if (isGuest) return null;

	let actionsDataRes = null;
	const notifUrl = `${PUBLIC_MF_CORE_BASE_URL}/notifications`;
	const res = await useFetch(notifUrl, {}, fetch);
	if (res.ok) {
		actionsDataRes = res?.data?.data || {};
		return actionsDataRes;
	} else if (res?.status < 500) {
		return null;
	} else {
		return new Error('Something Went Wrong');
	}
};
