import { base } from '$app/paths';
import type { UserProfile } from '$lib/types/IUserProfile';
import { useFetch } from './useFetch';

export const useProfileFetch = async (origin: string, token: string, fetch: FetchType) => {
	const profileData = await useFetch(
		`${origin}${base}/api/profile`,
		{
			headers: {
				authorization: `Bearer ${token}`,
				authtoken: token
			}
		},
		fetch
	);

	let data: UserProfile = {
		clientId: '',
		userType: '',
		dpNumber: ''
	};

	if (profileData.ok) {
		data = profileData?.data?.data;
	}

	return {
		...data
	};
};
