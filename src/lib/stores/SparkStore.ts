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
	deviceosversion: ''
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
		isSparkAndroidUser: () => {
			return sparkStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID;
		},
		isSparkIOSUser: () => {
			return sparkStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS;
		}
	};
}

export const appStore = Store();
