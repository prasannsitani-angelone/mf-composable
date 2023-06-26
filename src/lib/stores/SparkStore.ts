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
	isAngelBeeAndroidUser: () => boolean;
	isAngelBeeIosUser: () => boolean;
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
	},
	isAngelBeeAndroidUser: () => {
		return false;
	},
	isAngelBeeIosUser: () => {
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
			return sparkStore.platform.toLowerCase() || 'mf-web';
		},
		isSparkAndroidUser: () => {
			return sparkStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID;
		},
		isAngelBeeAndroidUser: () => {
			return sparkStore.platform.toLowerCase() === PLATFORM_TYPE.ANGELBEE_ANDROID;
		},
		isAngelBeeIosUser: () => {
			return sparkStore.platform.toLowerCase() === PLATFORM_TYPE.ANGELBEE_IOS;
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
		platformvariant: () => sparkStore.platformvariant || 'web',
		deviceid: () => sparkStore.deviceid,
		get: () => sparkStore,
		isTWA() {
			return sparkStore.platformvariant.toLowerCase() === 'twa';
		},
		isWebView() {
			return sparkStore.platformvariant.toLowerCase() === 'webview';
		}
	};
}

export const appStore = Store();
