import { writable } from 'svelte/store';

export const hydratedStore = writable({
	isHydrated: false
});
