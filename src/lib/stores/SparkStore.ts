import { PLATFORM_TYPE } from '$lib/constants/platform';
import { writable } from 'svelte/store';

export interface SparkStore {
	platform: string;
	platformversion: string;
	platformvariant: string;
	theme: string;
	clevertapclientid: string;
	guest: string | null;
	deviceid: string;
	closecta: string;
	deviceosversion: string;
	isSparkAndroidUser: () => boolean;
	isSparkIOSUser: () => boolean;
	isSparkUser: () => boolean;
}

const initalStore: SparkStore = {
	platform: '',
	platformversion: '',
	platformvariant: '',
	theme: '',
	clevertapclientid: '',
	guest: null,
	deviceid: '',
	closecta: '',
	deviceosversion: '',
	isSparkAndroidUser: () => {
		return false;
	},
	isSparkIOSUser: () => {
		return false;
	},
	isSparkUser: () => {
		return false;
	}
};
function Store() {
	const { subscribe, update } = writable(initalStore);
	let sparkStore: SparkStore;
	subscribe((v) => (sparkStore = v));
	return {
		subscribe,
		updateStore: (newStore: SparkStore) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		platform: () => {
			return sparkStore.platform.toLowerCase();
		},
		isSparkAndroidUser: () => {
			return sparkStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID;
		},
		isSparkIOSUser: () => {
			return sparkStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS;
		},
		isSparkUser: () => {
			return (
				sparkStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID ||
				sparkStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS
			);
		},
		closecta: () => sparkStore.closecta,
		platformversion: () => sparkStore.platformversion,
		platformvariant: () => sparkStore.platformvariant,
		deviceid: () => sparkStore.deviceid,

		isTWA() {
			return sparkStore.platformvariant.toLowerCase() === 'twa';
		},
		isWebView() {
			return sparkStore.platformvariant.toLowerCase() === 'webview';
		}
	};
}

export const appStore = Store();
