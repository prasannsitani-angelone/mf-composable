import { PLATFORM_TYPE } from '$lib/constants/platform';
import { writable } from 'svelte/store';

export interface SparkStore {
	platform: string;
	platformversion: string;
	platformvariant: string;
	theme: string;
	clevertapclientid: string;
	guest: string | null;
	deviceid: string;
	closecta: string;
	deviceosversion: string;
	isSparkAndroidUser: boolean;
	isSparkIOSUser: boolean;
	isAngelBeeAndroidUser: boolean;
	isAngelBeeIosUser: boolean;
	isTWA: boolean;
	isWebView: boolean;
	paymentapps: string;
	sessionId: string;
	linkedmembers: LinkedMembersHeaderTypes;
}

export interface LinkedMembersHeaderTypes {
	selected: string[];
}

const initalStore: SparkStore = {
	platform: '',
	platformversion: '',
	platformvariant: '',
	theme: '',
	clevertapclientid: '',
	guest: null,
	deviceid: '',
	closecta: '',
	deviceosversion: '',
	isSparkAndroidUser: false,
	isSparkIOSUser: false,
	isAngelBeeAndroidUser: false,
	isAngelBeeIosUser: false,
	isTWA: false,
	isWebView: false,
	paymentapps: '',
	sessionId: '',
	linkedmembers: {
		selected: []
	}
};

function Store() {
	const { subscribe, update } = writable(initalStore);
	let sparkStore: SparkStore;
	subscribe((v) => {
		sparkStore = v;
	});
	return {
		subscribe,
		updateStore: (newStore: SparkStore) => {
			return update((s) => {
				const consolidated = {
					...s,
					...newStore
				};
				const platform = consolidated.platform?.toLowerCase() || 'mf-web';
				const platformvariant = consolidated.platformvariant?.toLowerCase() || 'web';
				const isSparkAndroidUser = platform === PLATFORM_TYPE.SPARK_ANDROID;
				const isSparkIOSUser = platform === PLATFORM_TYPE.SPARK_IOS;
				const isAngelBeeAndroidUser = platform === PLATFORM_TYPE.ANGELBEE_ANDROID;
				const isAngelBeeIosUser = platform === PLATFORM_TYPE.ANGELBEE_IOS;
				const isTWA = platformvariant === 'twa';
				const isWebView = platformvariant === 'webview';
				const linkedmembers =
					typeof consolidated?.linkedmembers === 'string'
						? JSON?.parse(consolidated?.linkedmembers)
						: consolidated?.linkedmembers;

				return {
					...consolidated,
					platform,
					platformvariant,
					isSparkAndroidUser,
					isSparkIOSUser,
					isAngelBeeAndroidUser,
					isAngelBeeIosUser,
					isTWA,
					isWebView,
					linkedmembers
				};
			});
		},
		platform: () => {
			return sparkStore.platform?.toLowerCase() || 'mf-web';
		},
		isSparkAndroidUser: () => sparkStore.isSparkAndroidUser,
		isAngelBeeAndroidUser: () => sparkStore.isAngelBeeAndroidUser,
		isAngelBeeIosUser: () => sparkStore.isAngelBeeIosUser,
		isSparkIOSUser: () => sparkStore.isSparkIOSUser,
		closecta: () => sparkStore.closecta,
		platformversion: () => sparkStore.platformversion,
		platformvariant: () => sparkStore.platformvariant?.toLowerCase() || 'web',
		deviceid: () => sparkStore.deviceid,
		get: () => sparkStore,
		isTWA: () => sparkStore.isTWA,
		isWebView: () => sparkStore.isWebView,
		getLinkedMembers: () => sparkStore?.linkedmembers,
		isFamilyPortfolioSelected: (selfClientCode: string) => {
			let isFamilyPortfolioValue = false;
			const selectedLinkedMembers = sparkStore?.linkedmembers?.selected || [];

			if (
				selectedLinkedMembers?.length > 1 ||
				(selectedLinkedMembers?.length === 1 && selectedLinkedMembers[0] !== selfClientCode)
			) {
				isFamilyPortfolioValue = true;
			}

			return isFamilyPortfolioValue;
		},
		getSelectedLinkedMembersQuery: () => {
			const selectedLinkedMembers = sparkStore?.linkedmembers?.selected || [];
			let query = '';

			selectedLinkedMembers?.forEach((member) => {
				if (query?.length) {
					query = query + ',';
				}
				query = query + member;
			});

			return query;
		}
	};
}

export const appStore = Store();
