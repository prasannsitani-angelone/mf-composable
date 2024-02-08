export const callNativeMethod = (methodName: string, param: string) => {
	// ios implementation
	if (typeof window?.webkit?.messageHandlers?.[methodName]?.postMessage === 'function') {
		window?.webkit?.messageHandlers?.[methodName]?.postMessage(param);
	} else if (typeof window?.ShareDataHandler?.[methodName] === 'function') {
		window?.ShareDataHandler?.[methodName](param);
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
