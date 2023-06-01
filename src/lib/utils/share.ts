import { PLATFORM_TYPE } from '$lib/constants/platform';
import type { SparkStore } from '$lib/stores/SparkStore';

export const shareMessage = async (
	sparkHeaders: SparkStore,
	message: { title?: string; text: string }
) => {
	if (sparkHeaders.platform?.toLowerCase() === PLATFORM_TYPE.SPARK_IOS) {
		window?.webkit?.messageHandlers?.callBackHandlerMFShareOption?.postMessage(
			JSON.stringify(message)
		);
	} else {
		if (sparkHeaders?.platformvariant?.toLowerCase() === 'webview') {
			window?.ShareDataHandler?.share(JSON.stringify(message));
		} else {
			await navigator?.share?.(message);
		}
	}
};
