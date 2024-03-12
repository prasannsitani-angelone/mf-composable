/* eslint-disable */
export type WalletPaymentStateType = {
	paymentWindowInterval: any;
	waitTime: number;
};

// wallet logic
export const initializeGPayState = (gpayPaymentState: WalletPaymentStateType) => {
	if (gpayPaymentState.paymentWindowInterval) {
		clearInterval(gpayPaymentState.paymentWindowInterval);
		gpayPaymentState.paymentWindowInterval = null;
	}
};

export const googlePayCloseLogic = (params) => {
	const {
		gpayPaymentState,
		resetState,
		paymentModeName,
		// transactionRefNumber,
		// xRequestId,
		// source,
		showLoading,
		delay = 1
	} = params || {};
	let counter = 0;
	return new Promise((resolve) => {
		gpayPaymentState.paymentWindowInterval = setInterval(() => {
			if (document.visibilityState === 'visible' && document.hasFocus()) {
				// we can put put visibility change event to notify as soon as visibility changes instead of interval but in that case if visibility never goes away then that case will be stuck. ex if gpay not available
				showLoading(
					`This window will close in the next ${
						gpayPaymentState.waitTime - counter
					} seconds. Please complete the transaction from your ${paymentModeName}. Ignore if you have already completed the payment.`
				);
				counter++;
				if (counter >= gpayPaymentState.waitTime) {
					// triggerWalletStatus({
					// 	transactionRefNumber,
					// 	xRequestId,
					// 	source
					// });
					resetState();
					resolve('WINDOW_CLOSED');
				}
			} else {
				showLoading('Waiting for payment');
				counter = 0;
			}
		}, delay * 1000);
	});
};
