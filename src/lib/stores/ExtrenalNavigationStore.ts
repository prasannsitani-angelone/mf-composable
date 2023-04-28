import { writable } from 'svelte/store';

export const externalNavigation = writable({
	active: false
});
