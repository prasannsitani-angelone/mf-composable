import { base } from '$app/paths';
import type { FetchType } from '$lib/types/Fetch';
import type { UserProfile } from '$lib/types/IUserProfile';
import { useFetch } from './useFetch';

export const useProfileFetch = async (origin: string, token: string, fetch: FetchType) => {
	try {
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
	} catch (e) {
		console.log(
			JSON.stringify({
				level: 'error',
				type: 'Unexpected Error in profile',
				params: {
					error: e?.toString()
				}
			})
		);
		return {};
	}
};
