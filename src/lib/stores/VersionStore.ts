import { writable } from 'svelte/store';

interface VERSION {
	version: string;
}

const initalStore: VERSION = {
	version: ''
};

function CreateStore() {
	const { subscribe, set } = writable(initalStore);
	return {
		subscribe,
		setVersion: (version: string) =>
			set({
				version
			})
	};
}

export const versionStore = CreateStore();
