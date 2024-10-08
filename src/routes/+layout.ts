import type { SparkStore } from '$lib/stores/SparkStore';
import type { PageLoad } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { browser } from '$app/environment';
import sessionStorage from '$lib/utils/sessionStorage';
import { decodeToObject } from '$lib/utils/helpers/params';
import { tokenStore } from '$lib/stores/TokenStore';
import Analytics from '$lib/utils/analytics';
import {
	PUBLIC_ANALYTICS_ENABLED,
	PUBLIC_ANALYTICS_URL,
	PUBLIC_NBU_LOGGER_URL
} from '$env/static/public';

const isObjectWithNonEmptyKeys = (obj: Record<string, string | null>) => {
	try {
		const result = Object.keys(obj).filter((key) => {
			return Boolean(obj[key]);
		});
		return Boolean(result.length > 0);
	} catch (err) {
		return false;
	}
};
const hydrateSessionData = (sparkHeaders: SparkStore) => {
	const sessionStorageData = sessionStorage.getObject('sparkStore');
	const data = {
		platform: sparkHeaders?.platform,
		platformversion: sparkHeaders?.platformversion,
		platformvariant: sparkHeaders?.platformvariant,
		theme: sparkHeaders?.theme,
		clevertapclientid: sparkHeaders?.clevertapclientid,
		guest: sparkHeaders?.guest,
		closecta: sparkHeaders?.closecta,
		deviceosversion: sparkHeaders?.deviceosversion,
		paymentapps: sparkHeaders?.paymentapps,
		sessionId: sparkHeaders?.sessionId,
		linkedmembers: sparkHeaders?.linkedmembers,
		isTabView: sparkHeaders?.isTabView,
		openViaTabView: sparkHeaders?.openViaTabView,
		homeTabs: sparkHeaders?.homeTabs
	};

	const setSessionIds = () => {
		const mfSessionId = sessionStorage.getItem('sessionId') || uuidv4();
		sessionStorage.setItem('sessionId', mfSessionId);
		tokenStore.updateStore({ sparkSessionID: data.sessionId, mfSessionID: mfSessionId });
	};
	setSessionIds();

	if (isObjectWithNonEmptyKeys(data)) {
		sessionStorage.setObject('sparkStore', data);
		return data;
	} else if (isObjectWithNonEmptyKeys(sessionStorageData)) {
		return sessionStorageData;
	}
	return {};
};

const hydrateLocalStorageData = (sparkHeaders: SparkStore, sparkQuery: SparkStore) => {
	const deviceid = sparkHeaders.deviceid || sparkQuery?.deviceid;
	const localStorageDeviceID = localStorage.getItem('deviceid');
	if (!deviceid && !localStorageDeviceID) {
		const generatedDeviceID = uuidv4();
		localStorage.setItem('deviceid', generatedDeviceID);
		return {
			deviceid: generatedDeviceID
		};
	} else if (!deviceid) {
		return {
			deviceid: localStorageDeviceID
		};
	} else {
		localStorage.setItem('deviceid', deviceid);
		return {
			deviceid
		};
	}
};

const hydrateAppVariables = (sparkHeaders: SparkStore, sparkQuery: SparkStore) => {
	try {
		const sessionData = hydrateSessionData(sparkHeaders);
		const localStorageData = hydrateLocalStorageData(sparkHeaders, sparkQuery);
		return {
			...sessionData,
			...localStorageData
		};
	} catch (e) {
		return sparkHeaders;
	}
};
export const load = (async ({ data, url }) => {
	const urlParams = url.searchParams.get('params') || url.searchParams.get('param') || '';

	const decodedParams = decodeToObject(urlParams);
	const urlSource = decodedParams || {};

	if (browser) {
		Analytics.init({
			batchSize: 10,
			baseUrl: '',
			url: PUBLIC_ANALYTICS_URL,
			enabled: PUBLIC_ANALYTICS_ENABLED,
			initialised: true,
			NBULoggerUrl: PUBLIC_NBU_LOGGER_URL,
			NBULoggeraccessToken: data.token
		});
	}

	const hydrated = browser
		? hydrateAppVariables(data.sparkHeaders, data.sparkQuery)
		: data.sparkHeaders;
	return {
		...data,
		sparkHeaders: hydrated,
		urlSource
	};
}) satisfies PageLoad;
