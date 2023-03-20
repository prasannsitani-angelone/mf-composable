import { profileStore } from '$lib/stores/ProfileStore';
import { tokenStore } from '$lib/stores/TokenStore';

export const MFCommonHeader = () => {
	const headers = {
		userType: `${profileStore.userType()}`,
		accountType: `${profileStore?.accountType()}`,
		authorization: `Bearer ${tokenStore.activeToken()}`
	};

	return headers;
};
