// See https://kit.svelte.dev/docs/types#app

import type { DiscoverFund } from '$lib/types/IDiscoverFunds';
import type { UserProfile } from '$lib/types/IUserProfile';
import type { DevicePayload } from 'sveltekit-device-detector/dist/types';
import * as servertime from 'servertime';
interface LayoutConfig {
	title: string;
	showBackIcon: boolean;
	component: class;
	showBottomNavigation: boolean;
	showSearchIcon: boolean;
	showCloseIcon: boolean;
	showShareIcon: boolean;
	onClickShareIcon: (() => void) | null;
	layoutType:
		| 'TWO_COLUMN'
		| 'TWO_COLUMN_REVERSE'
		| 'TWO_COLUMN_RIGHT_LARGE'
		| 'FULL_HEIGHT_WITHOUT_PADDING';
}
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
			serverTiming: servertime.ServertimeOptions;
		}
		interface PageData {
			deviceType: DevicePayload;
			searchDashboardData: DiscoverFund;
			layoutConfig: LayoutConfig;
		}
		// interface Platform {}
	}
}

export {};
