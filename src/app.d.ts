// See https://kit.svelte.dev/docs/types#app

import type { DeviceType } from 'sveltekit-device-detector/dist/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			deviceType: DeviceType;
			host: string;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
