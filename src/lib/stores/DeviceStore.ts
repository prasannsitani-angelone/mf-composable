import type { DevicePayload } from 'sveltekit-device-detector/dist/types';
import { writable } from 'svelte/store';

const initalStore: DevicePayload = {
	browserName: '',
	osName: '',
	osVersion: '',
	os: '',
	userAgent: '',
	ua: '',
	vendor: '',
	model: '',
	browserFullVersion: ''
};

function CreateStore() {
	const { subscribe, set, update } = writable(initalStore);
	let deviceType: DevicePayload;
	subscribe((v) => {
		deviceType = v;
	});
	return {
		subscribe,
		updateStore: (newStore: DevicePayload) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		},
		set: (store: DevicePayload) => set(store),
		browserName: () => deviceType.browserName,
		osName: () => deviceType.osName || deviceType.os,
		osVersion: () => deviceType.osVersion,
		userAgent: () => deviceType.userAgent || deviceType.ua,
		vendor: () => deviceType.vendor,
		model: () => deviceType.model,
		browserFullVersion: () => deviceType.browserFullVersion
	};
}

export const deviceStore = CreateStore();
