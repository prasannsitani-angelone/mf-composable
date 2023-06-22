import { dev } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import { useFetch } from '$lib/utils/useFetch';

export const getsearchDashboardData = async (
	token: string,
	fetch: FetchType,
	internalBaseUrl?: string,
	userType?: string
) => {
	const url = `${
		internalBaseUrl && !dev ? internalBaseUrl : PUBLIC_MF_CORE_BASE_URL
	}/schemes/searchDashboard?options=true`;
	const res = await useFetch(
		url,
		{
			headers: {
				authorization: `Bearer ${token}`,
				userType: userType ? userType : 'B2C'
			}
		},
		fetch
	);
	if (res.ok) {
		const discoverFundData = res.data;
		return {
			...discoverFundData
		};
	} else {
		return {
			searchOptions: [],
			weeklyTopSchemes: []
		};
	}
};
