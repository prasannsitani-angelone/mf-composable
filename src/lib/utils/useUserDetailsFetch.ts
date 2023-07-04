import { dev } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import type { IUserDetails } from '$lib/types/IUserDetails';
import { useFetch } from './useFetch';

export const useUserDetailsFetch = async (
	token: string,
	fetch: FetchType,
	internalBaseUrl?: string
) => {
	const url = `${internalBaseUrl && !dev ? internalBaseUrl : PUBLIC_MF_CORE_BASE_URL}/user`;
	const userDetails = await useFetch(
		url,
		{
			headers: {
				authorization: `Bearer ${token}`
			}
		},
		fetch
	);

	let user: IUserDetails = {
		userType: 'B2C'
	};

	if (userDetails.ok) {
		user = userDetails?.data;
	}

	return {
		...user
	};
};
