import { base } from '$app/paths';
import { get } from '$lib/api';
import type { UserProfile } from '$lib/types/IUserProfile';

export const useProfileFetch = async (origin: string, locals: object) => {
	const profileData = await get(`${origin}${base}/api/profile`, locals);
	const { data }: { data: UserProfile } = profileData;
	return {
		...data
	};
};
