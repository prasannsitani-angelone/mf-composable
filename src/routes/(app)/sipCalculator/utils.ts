export function linearInterpolator(
	startValue: number,
	endValue: number,
	duration: number,
	initialDelay = 0,
	progressFunc: (progress: number) => void
) {
	const interval = 10; // Adjust the interval for smoother progression
	const startTime = new Date().getTime();

	const intervalId = setInterval(function () {
		const currentTime = new Date().getTime();
		let elapsedTime = currentTime - startTime;

		if (elapsedTime >= initialDelay) {
			// Subtract initial delay from elapsed time before starting incrementation
			elapsedTime -= initialDelay;
			if (elapsedTime >= duration) {
				clearInterval(intervalId);
				progressFunc(endValue);
			} else {
				const progress = Math.floor(
					(elapsedTime / duration) * (endValue - startValue) + startValue
				);
				progressFunc(progress);
			}
		}
	}, interval);
}

export const getDisplayAmount = (amount: number) => {
	if (amount > 1000000000) {
		return (amount / 1000000000).toFixed(2) + 'Bn';
	}
	if (amount > 10000000) {
		return (amount / 10000000).toFixed(2) + 'Cr';
	}
	if (amount > 100000) {
		return (amount / 100000).toFixed(1) + 'L';
	}
	if (amount > 1000) {
		return (amount / 1000).toFixed(1) + 'K';
	}
	return amount;
};
