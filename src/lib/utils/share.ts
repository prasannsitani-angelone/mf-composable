export const shareMessage = async (message: { title?: string; text: string }) => {
	if (
		typeof window?.webkit?.messageHandlers?.callBackHandlerMFShareOption?.postMessage === 'function'
	) {
		window?.webkit?.messageHandlers?.callBackHandlerMFShareOption?.postMessage(
			JSON.stringify(message)
		);
	} else {
		if (typeof window?.ShareDataHandler?.share === 'function') {
			window?.ShareDataHandler?.share(JSON.stringify(message));
		} else {
			await navigator?.share?.(message);
		}
	}
};

export const copyToClipboard = async (message: string) => {
	if (typeof navigator?.clipboard?.writeText !== 'function') {
		shareMessage({ text: message });
		return;
	}
	try {
		await navigator?.clipboard?.writeText(message);
	} catch (e) {
		shareMessage({ text: message });
	}
};
