import { writable } from 'svelte/store';

export const overlay = writable({
	isOpen: false
});
