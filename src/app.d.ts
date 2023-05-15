// See https://kit.svelte.dev/docs/types#app

import type { DiscoverFund } from '$lib/types/IDiscoverFunds';
import type { UserProfile } from '$lib/types/IUserProfile';
import type { DevicePayload } from 'sveltekit-device-detector/dist/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			deviceType: DevicePayload;
			host: string | null;
			userType: string;
			accountType: string;
			token: string;
			userDetails: IUserDetails;
			profileData: UserProfile;
			refreshToken: string;
			isGuest: boolean;
		}
		interface PageData {
			deviceType: DevicePayload;
			searchDashboardData: DiscoverFund;
		}
		// interface Platform {}
	}
}

export {};
