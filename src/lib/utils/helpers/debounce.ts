type CallbackFunction = (...args: any[]) => void;
export const debounce = (fn: CallbackFunction, ms = 300) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	function runnable(this: any, ...args: any[]) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	}
	runnable.cancel = function () {
		clearTimeout(timeoutId); // clears the timeout
	};
	return runnable;
};
