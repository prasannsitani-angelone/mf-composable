import { goto } from '$app/navigation';
import { appStore } from '$lib/stores/SparkStore';
import { versionStore } from '$lib/stores/VersionStore';
import { callNativeMethod } from './callNativeMethod';
import { isAbsoluteUrl } from './helpers/url';

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
		await goto(url, options);
	}
};
