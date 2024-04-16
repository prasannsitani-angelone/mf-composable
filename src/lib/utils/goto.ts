import { goto } from '$app/navigation';
import { appStore } from '$lib/stores/SparkStore';
import { versionStore } from '$lib/stores/VersionStore';
import { callNativeMethod } from './callNativeMethod';
import { isAbsoluteUrl } from './helpers/url';
import { browserHistoryStore } from '$lib/stores/BrowserHistoryStore';

interface GotoOptions {
	replaceState?: boolean | undefined;
	noScroll?: boolean | undefined;
	keepFocus?: boolean | undefined;
	invalidateAll?: boolean | undefined;
	state?: App.PageState | undefined;
}

export const modifiedGoto = async (url: string, options?: GotoOptions): Promise<void> => {
	if (appStore.isTabview()) {
		let urlWithQuery = url;
		if (versionStore.getVersion()) {
			if (urlWithQuery.includes('?')) {
				urlWithQuery = `${urlWithQuery}&version=${versionStore.getVersion()}`;
			} else {
				urlWithQuery = `${urlWithQuery}?version=${versionStore.getVersion()}`;
			}
		}
		const newUrl = isAbsoluteUrl(urlWithQuery)
			? urlWithQuery
			: `${window.location.origin}${urlWithQuery}`;
		callNativeMethod(
			'openMF',
			JSON.stringify({
				url: newUrl,
				options
			})
		);
	} else {
		updateBrowserStore(url, options);
		await goto(url, options);
	}
};

/**
 * Updates the browser store initial with the provided URL.
 * If the `replaceState` option is set and the initial URL in the browser history store is the same as the current URL,
 * the initial URL in the store is updated to the new URL.
 */
const updateBrowserStore = (url: string, options?: GotoOptions): void => {
	const currentUrl = `${window.location.origin}${window.location.pathname}`;
	if (options?.replaceState && browserHistoryStore.get().initialUrl === currentUrl) {
		const newUrl = `${window.location.origin}${url}`;
		browserHistoryStore.updateStore({
			initialUrl: newUrl
		});
	}
};
