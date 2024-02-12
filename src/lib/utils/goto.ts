import { goto } from '$app/navigation';
import { appStore } from '$lib/stores/SparkStore';
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
		const newUrl = isAbsoluteUrl(url) ? url : `${window.location.origin}${url}`;
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
