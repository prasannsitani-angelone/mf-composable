import { derived } from 'svelte/store';
import { appStore } from '$lib/stores/SparkStore';

interface AppTheme {
	name: string;
}

const LightTheme: AppTheme = {
	name: 'light'
};
const DarkTheme: AppTheme = {
	name: 'dark'
};

const SupportedThemes: AppTheme[] = [LightTheme, DarkTheme];

const defaultTheme: AppTheme = LightTheme;

export const getThemeObject = (themeString: string) =>
	SupportedThemes.find((item) => item.name === themeString) || defaultTheme;

function createStore() {
	let store: AppTheme;
	const { subscribe } = derived(
		appStore,
		($appStore, set, update) => {
			const themeObj = getThemeObject($appStore.theme);
			update(() => {
				return themeObj;
			});
		},
		defaultTheme
	);

	subscribe((v) => {
		store = v;
	});

	return {
		subscribe,
		getTheme: () => store
	};
}

export const themeStore = createStore();
