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
