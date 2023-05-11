import { browser } from '$app/environment';
import type { IOrderFilter } from '$lib/types/IOrderFilter';
import { writable } from 'svelte/store';

let initalStore: IOrderFilter = {
	failed: false,
	completed: false,
	inprogress: false
};

if (browser) {
	initalStore = JSON.parse(
		window.sessionStorage.getItem('filter') ||
			'{"failed":false,"completed":false,"inprogress":false}'
	);
}

function CreateStore() {
	const { subscribe, update } = writable(initalStore);
	subscribe((v) => {
		if (browser) {
			window.sessionStorage.setItem('filter', JSON.stringify(v));
		}
	});
	return {
		subscribe,
		updateStore: (newStore: IOrderFilter) => {
			return update((s) => {
				return { ...s, ...newStore };
			});
		}
	};
}

export const filterStore = CreateStore();
