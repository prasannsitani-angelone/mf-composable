import { format } from 'date-fns';
import { fetchMandateTransactionDataFunc, fetchTransactionDataFunc } from './api';

export const getFormattedSIPDate = (date: Date) => {
	return format(date, 'yyyy-MM-dd');
};

// transaction
export const mandateTransactionRetryLogic = ({
	state,
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
				transactionResponse = await fetchMandateTransactionDataFunc({
					xRequestId,
					source
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
