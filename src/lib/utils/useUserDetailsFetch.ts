import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import { useFetch } from './useFetch';

export const useUserDetailsFetch = async (token: string, fetch: FetchType) => {
	const userDetails = await useFetch(
		`${PUBLIC_MF_CORE_BASE_URL}/user`,
		{
			headers: {
				authorization: `Bearer ${token}`,
				authtoken: token
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
