import { goto } from '$app/navigation';
import { appStore } from '$lib/stores/SparkStore';

interface GotoOptions {
	replaceState?: boolean | undefined;
	noScroll?: boolean | undefined;
	keepFocus?: boolean | undefined;
	invalidateAll?: boolean | undefined;
	state?: App.PageState | undefined;
}

export const modifiedGoto = async (url: string, options?: GotoOptions): Promise<void> => {
	if (appStore.isTabview()) {
		callNativeMethod(
			'openMF',
			JSON.stringify({
				url,
				options
			})
		);
	} else {
		await goto(url, options);
	}
};
