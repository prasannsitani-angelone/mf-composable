type LifeCycleCallback = {
	event: string;
	callback: () => void;
};

const callbacksArray: LifeCycleCallback[] = [];

const checkIfNativeLifeCycleCallbackExists = (event: string, callback: () => void) => {
	const indexOf = callbacksArray.findIndex(
		({ event: lifeCycleEvent, callback: lifeCycleCallback }) => {
			return lifeCycleEvent === event && lifeCycleCallback === callback;
		}
	);

	return indexOf;
};

export const removeNativeLifeCycleCallback = (event: string, callback: () => void) => {
	const indexOf = checkIfNativeLifeCycleCallbackExists(event, callback);

	if (indexOf > -1) {
		callbacksArray.splice(indexOf, 1);
	}
};

export const addNativeLifeCycleCallback = (event: string, callback: () => void) => {
	const indexOf = checkIfNativeLifeCycleCallbackExists(event, callback);
	if (indexOf > -1) {
		return;
	}
	callbacksArray.push({ event, callback });

	window.onWebViewCallback = (payload: string) => {
		for (const callback of callbacksArray) {
			if (payload?.['type']?.toUpperCase() === callback?.event?.toUpperCase()) {
				callback?.callback();
			}
		}
	};
};
