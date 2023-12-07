import { writable } from 'svelte/store';

interface VERSION {
	version: string;
}

const initalStore: VERSION = {
	version: 'A'
};

function CreateStore() {
	const { subscribe, set } = writable(initalStore);
	let version = 'A';
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
