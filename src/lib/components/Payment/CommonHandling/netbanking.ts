import logger from '$lib/utils/logger';

/* eslint-disable */
export type NetBankingStateType = {
	paymentWindow: any;
	paymentWindowInterval: any;
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

export const isNetBakingPaymentWindowClosed = (netBankingState: NetBankingStateType) => {
	return (
		!netBankingState.paymentWindow ||
		(netBankingState.paymentWindow && netBankingState.paymentWindow.closed)
	);
};

export const closeNetBankingPaymentWindow = (netBankingState: NetBankingStateType) => {
	if (netBankingState.paymentWindow) {
		netBankingState.paymentWindow.close();
		netBankingState.paymentWindow = null;
	}
};

export const intializeNetBankingState = (
	netBankingState: NetBankingStateType,
	closePaymentWindow = true
) => {
	if (netBankingState.paymentWindowInterval) {
		clearInterval(netBankingState.paymentWindowInterval);
		netBankingState.paymentWindowInterval = null;
	}
	if (closePaymentWindow) {
		closeNetBankingPaymentWindow(netBankingState);
	}
};

export const listenerFunc = (event, netBankingState: NetBankingStateType) => {
	if (location.origin === event?.origin && event?.data?.source === 'paymentCallback') {
		logger.debug({
			type: 'Payment Redirection Response',
			params: event?.data
		});
		closeNetBankingPaymentWindow(netBankingState);
	}
};
