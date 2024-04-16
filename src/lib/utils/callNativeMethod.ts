export const callNativeMethod = (methodName: string, ...args: string[]) => {
	// ios implementation
	if (typeof window?.webkit?.messageHandlers?.[methodName]?.postMessage === 'function') {
		window?.webkit?.messageHandlers?.[methodName]?.postMessage(...args);
	} else if (typeof window?.ShareDataHandler?.[methodName] === 'function') {
		window?.ShareDataHandler?.[methodName](...args);
	}
};

export const checkNativeMethodExist = (methodName: string) => {
	if (
		typeof window?.webkit?.messageHandlers?.[methodName]?.postMessage === 'function' ||
		typeof window?.ShareDataHandler?.[methodName] === 'function'
	) {
		return true;
	}
	return false;
};

export const notifyPopupWindowChange = ({ isOpen = false, showAsFullScreen = false }) => {
	if (checkNativeMethodExist('onPopUpWindow')) {
		callNativeMethod(
			'onPopUpWindow',
			JSON.stringify({
				isOpen: isOpen,
				showAsFullScreen: showAsFullScreen,
				product: 'MF'
			})
		);
	}
};
