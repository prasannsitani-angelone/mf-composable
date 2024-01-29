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
		// ios implementation
		if (typeof window?.webkit?.messageHandlers?.openMF?.postMessage === 'function') {
			window?.webkit?.messageHandlers?.openMF?.postMessage(
				JSON.stringify({
					url,
					options
				})
			);
		} else {
			if (typeof window?.ShareDataHandler?.openMF === 'function') {
				window?.ShareDataHandler?.openMF(
					JSON.stringify({
						url,
						options
					})
				);
			}
		}
	} else {
		await goto(url, options);
	}
};
