import { writable } from 'svelte/store';
import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
import { appStore } from '$lib/stores/SparkStore';

const initialStore: ExitNudgeType = {
	showExitNudge: false,
	nudgeDataAvailable: false
};

function createStore() {
	const { subscribe, set, update } = writable(initialStore);

	const setShown = () => {
		localStorage.setItem('showExitNudge', 'false');
	};

	let store: ExitNudgeType;
	subscribe((v) => {
		store = v;
	});
	return {
		subscribe,
		hasNudgeData: (nudgeDataAvailable: boolean) => {
			return update((s) => {
				const obj = { ...s, ...{ nudgeDataAvailable } };
				return obj;
			});
		},
		shouldShow: (): boolean => {
			const isLoggedIn = tokenStore.state() === AUTH_STATE_ENUM.LOGGED_IN;
			const isSparkUser = appStore.isSparkIOSUser() || appStore.isSparkAndroidUser();
			return (
				store.nudgeDataAvailable &&
				isLoggedIn &&
				isSparkUser &&
				(localStorage.getItem('showExitNudge') || 'true') === 'true'
			);
		},
		setShown,
		hideNudge: () => {
			store.showExitNudge = false;
			set(store);
		},
		showNudge: () => {
			store.showExitNudge = true;
			set(store);
			setShown();
		}
	};
}

export const exitNudgeStore = createStore();

export interface ExitNudgeType {
	showExitNudge: boolean;
	nudgeDataAvailable: boolean;
}
