import { PLATFORM_TYPE } from '$lib/constants/platform';
import { writable } from 'svelte/store';

enum GuestUser {
	YES = 'yes',
	NO = 'no'
}

export const HOME_TABS_MAP = {
	mf: 'mf'
};

export interface SparkStore {
	platform: string;
	platformversion: string;
	platformvariant: string;
	theme: string;
	clevertapclientid: string;
	guest: GuestUser | null;
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
	isTabView: boolean;
	openViaTabView: boolean;
	homeTabs: string[];
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
	},
	isTabView: false,
	openViaTabView: false,
	homeTabs: []
};

const parseLinkedMember = (linkedmembers: string) => {
	try {
		return JSON?.parse(linkedmembers);
	} catch (e) {
		return {
			selected: []
		};
	}
};

const parseHomeTabs = (tabs: string) => {
	if (!tabs) {
		return [];
	}
	try {
		const parsedTabs: string[] = JSON.parse(tabs);
		const homeTabs: string[] = parsedTabs.flatMap((tab) => HOME_TABS_MAP[tab] || []);
		return homeTabs;
	} catch (err) {
		return [];
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
						? parseLinkedMember(consolidated?.linkedmembers)
						: consolidated?.linkedmembers;
				const isTabView =
					typeof consolidated?.isTabView === 'boolean'
						? consolidated?.isTabView
						: consolidated?.isTabView === 'true';
				const openViaTabView =
					typeof consolidated?.openViaTabView === 'boolean'
						? consolidated?.openViaTabView
						: consolidated?.openViaTabView === 'true';
				const homeTabs =
					typeof consolidated?.homeTabs === 'string'
						? parseHomeTabs(consolidated.homeTabs)
						: consolidated.homeTabs;
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
					linkedmembers,
					isTabView,
					openViaTabView,
					homeTabs
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
		},
		isTabview: () => sparkStore?.isTabView,
		openViaTabView: () => sparkStore?.openViaTabView,
		isSparkGuestUser: () => sparkStore?.guest?.toLowerCase() === GuestUser.YES,
		homeTabs: () => sparkStore?.homeTabs,
		isTabAvailable: (tabName: string) => sparkStore?.homeTabs?.includes(tabName),
		isMFTabAvailable: () => sparkStore?.homeTabs?.includes(HOME_TABS_MAP.mf)
	};
}

export const appStore = Store();
