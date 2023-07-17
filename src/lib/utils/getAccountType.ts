import type { UserProfile } from '$lib/types/IUserProfile';

export const accountType = (userProfile: UserProfile, isGuest: boolean) => {
	if (isGuest) {
		return 'D';
	}

	return userProfile?.dpNumber ? 'D' : 'P';
};
