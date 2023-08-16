import { format } from 'date-fns';
import { fetchTransactionDataFunc, triggerWalletStatus } from './api';

export const getFormattedSIPDate = (date: Date) => {
	return format(date, 'yyyy-MM-dd');
};

export const transactionRetryLogic = ({
	state,
	transactionID,
	xRequestId,
	source,
	retryNumber = 0,
	retries = 100,
	retryDelay = 3,
	resetState
}) => {
	let transactionPending = false;
	let transactionResponse = {};
	return new Promise((resolve) => {
		state.interval = setInterval(async () => {
			if (!transactionPending) {
				transactionPending = true;
				transactionResponse = await fetchTransactionDataFunc({
					xRequestId,
					source,
					transactionID
				});
				if (
					transactionResponse.ok &&
					(transactionResponse.data?.data?.status === 'success' ||
						transactionResponse.data?.data?.status === 'failure')
				) {
					resetState();
					resolve(transactionResponse);
				}
				transactionPending = false;
			}
			retryNumber = retryNumber + 1;
			if (retryNumber >= retries) {
				resetState();
				resolve(transactionResponse);
			}
		}, retryDelay * 1000);
	});
};

export const resetTransactionInterval = (state) => {
	if (state.interval) {
		clearInterval(state.interval);
	}
};

// net banking logic
export const netBankingWindowCloseLogic = (params) => {
	const { netBankingState, resetState, delay = 1 } = params || {};
	return new Promise((resolve) => {
		netBankingState.paymentWindowInterval = setInterval(() => {
			if (isNetBakingPaymentWindowClosed(netBankingState)) {
				resetState();
				resolve(true);
			}
		}, delay * 1000);
	});
};

export const isNetBakingPaymentWindowClosed = (netBankingState) => {
	return (
		!netBankingState.paymentWindow ||
		(netBankingState.paymentWindow && netBankingState.paymentWindow.closed)
	);
};

export const closeNetBankingPaymentWindow = (netBankingState) => {
	if (netBankingState.paymentWindow) {
		netBankingState.paymentWindow.close();
		netBankingState.paymentWindow = null;
	}
};

export const intializeNetBankingState = (netBankingState, closePaymentWindow = true) => {
	if (netBankingState.paymentWindowInterval) {
		clearInterval(netBankingState.paymentWindowInterval);
		netBankingState.paymentWindowInterval = null;
	}
	if (closePaymentWindow) {
		closeNetBankingPaymentWindow(netBankingState);
	}
};

// upi logic

export const initializeUPIState = (upiState) => {
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

// wallet logic

export const initializeGPayState = (gpayPaymentState) => {
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
		transactionRefNumber,
		xRequestId,
		source,
		showLoading,
		delay = 1
	} = params || {};
	let counter = 0;
	return new Promise((resolve) => {
		gpayPaymentState.paymentWindowInterval = setInterval(() => {
			if (document.hasFocus()) {
				showLoading(
					`This window will close in the next ${
						gpayPaymentState.waitTime - counter
					} seconds. Please complete the transaction from your ${paymentModeName}. Ignore if you have already completed the payment.`
				);
				counter++;
				if (counter >= gpayPaymentState.waitTime) {
					triggerWalletStatus({
						transactionRefNumber,
						xRequestId,
						source
					});
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
