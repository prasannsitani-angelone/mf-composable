import { writable } from 'svelte/store';

interface VERSION {
	version: string;
}

const initalStore: VERSION = {
	version: ''
};

function CreateStore() {
	const { subscribe, set } = writable(initalStore);
	let version = '';
	subscribe((v) => {
		version = v.version || '';
	});
	return {
		subscribe,
		getVersion: () => version,
		setVersion: (version: string) =>
			set({
				version
			})
	};
}

export const versionStore = CreateStore();
