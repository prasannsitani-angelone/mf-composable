import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import { writable } from 'svelte/store';

export interface UPIHandlers {
	data: string[];
	error: object;
	isLoading: boolean;
}

const initalStore: UPIHandlers = {
	data: [],
	isLoading: false,
	error: {}
};

const MAX_SUGGESTION = 4;

function CreateStore() {
	const { subscribe, update } = writable(initalStore);
	let data = initalStore;
	subscribe((v) => {
		data = v;
	});
	return {
		fetchData: async () => {
			update((s) => {
				return { ...s, isLoading: true };
			});

			const response = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/utils/meta?upiHandlers=true`);

			if (response.ok) {
				update((s) => {
					return { ...s, isLoading: false, data: response.data || [] };
				});
			} else {
				update((s) => {
					return { ...s, isLoading: false, error: response.data };
				});
			}
		},
		isLoaded: () => {
			if (data.data?.length > 0) {
				return true;
			}
			return false;
		},
		getSuggestions: (text = '', staticText = '') => {
			const result = [];
			if (data.data?.length > 0) {
				data.data.forEach((item) => {
					if (item?.toLowerCase()?.indexOf(text?.toLowerCase()) === 0) {
						result.push(`${staticText}${item}`);
					}
				});
			}
			return result.length > MAX_SUGGESTION ? result.slice(0, MAX_SUGGESTION) : result;
		}
	};
}

export const upiHandlersStore = CreateStore();
