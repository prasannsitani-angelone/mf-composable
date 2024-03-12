/* eslint-disable */
export type UpiStateType = {
	flow: number;
	timer: number;
	timerInterval: any;
	paymentWindowInterval: any;
};

// upi logic
export const initializeUPIState = (upiState: UpiStateType) => {
	upiState.flow = 0;
	upiState.timer = 0;
	if (upiState.timerInterval) {
		clearInterval(upiState.timerInterval);
		upiState.timerInterval = null;
	}
	if (upiState.paymentWindowInterval) {
		clearInterval(upiState.paymentWindowInterval);
		upiState.paymentWindowInterval = null;
	}
};

export const upiWindowCloseLogic = (params) => {
	const { upiState, resetState, delay = 1 } = params || {};
	return new Promise((resolve) => {
		upiState.paymentWindowInterval = setInterval(() => {
			if (!upiState.flow) {
				resetState();
				resolve('WINDOW_CLOSED');
			}
		}, delay * 1000);
	});
};
