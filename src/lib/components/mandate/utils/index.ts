import { add, sub } from 'date-fns';
import { fetchTransactionDataFunc } from '../api';

export const getMandateAmount = (mode: string, amount: number) => {
	if (!mode) {
		return '';
	}
	if (mode === 'NET_BANKING') {
		if (amount <= 100000) {
			return 100000;
		} else if (amount <= 500000) {
			return 500000;
		} else if (amount > 500000) {
			return 1000000;
		}
		return 100000;
	} else {
		return 15000;
	}
};

// net banking logic
export const netBankingWindowCloseLogic = (params) => {
	const { netBankingState, delay = 1 } = params || {};
	return new Promise((resolve) => {
		netBankingState.paymentWindowInterval = setInterval(() => {
			if (isNetBakingPaymentWindowClosed(netBankingState)) {
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
	const { gpayPaymentState, resetState, emandateModeName, showLoading, delay = 1 } = params || {};
	let counter = 0;
	return new Promise((resolve) => {
		gpayPaymentState.paymentWindowInterval = setInterval(() => {
			if (document.visibilityState === 'visible' && document.hasFocus()) {
				// we can put put visibility change event to notify as soon as visibility changes instead of interval but in that case if visibility never goes away then that case will be stuck. ex if gpay not available
				showLoading(
					`This window will close in the next ${
						gpayPaymentState.waitTime - counter
					} seconds. Please complete the transaction from your ${emandateModeName}. Ignore if you have already completed the payment.`
				);
				counter++;
				if (counter >= gpayPaymentState.waitTime) {
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

//

export const transactionRetryLogic = ({
	state,
	mandateID,
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
					mandateID
				});
				if (
					transactionResponse.ok &&
					(transactionResponse.data?.data?.status === 'registration_successful' ||
						transactionResponse.data?.data?.status === 'registration_failed')
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

export const getSipEndDate = (startDate) => {
	try {
		return sub(
			add(startDate, {
				months: 360
			}),
			{
				days: 1
			}
		).getTime();
	} catch (e) {
		return '';
	}
};
