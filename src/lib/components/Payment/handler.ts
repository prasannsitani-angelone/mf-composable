import { orderDeletePatchFunc } from './api';
import { intializeNetBankingState, isNetBakingPaymentWindowClosed } from './util';

export const handleTransactionResponse = async (params) => {
	const { transactionResponse, failureCallback, pendingCallback } = params;
	if (transactionResponse.ok) {
		if (transactionResponse.data?.data?.status === 'failure') {
			await failureCallback();
			throw new Error('');
		} else if (transactionResponse.data?.data?.status === 'pending') {
			await pendingCallback();
			throw new Error('');
		}
	} else {
		await pendingCallback();
		throw new Error('');
	}
};

export const handleUPIValidationResponse = (params) => {
	const { onUPIValidationFailure, upiValidationResponse } = params;
	if (upiValidationResponse.ok && !upiValidationResponse.data?.data?.valid) {
		onUPIValidationFailure('Please enter valid UPI ID');
		throw new Error('');
	} else if (!upiValidationResponse.ok) {
		onUPIValidationFailure(
			upiValidationResponse.data?.message || upiValidationResponse.data?.data?.message
		);
		throw new Error('');
	}
};

export const handleEmandateResponse = (params) => {
	const { emandateResponse, stopLoading, resetState, displayError } = params || {};
	if (!emandateResponse.ok) {
		stopLoading();
		resetState();
		displayError({
			heading: 'Error',
			errorSubHeading:
				'We are facing some issue at our end. Please try again or contact field support'
		});
		throw new Error('');
	}
};

export const handleUPIResponse = (params) => {
	const { upiResponse, stopLoading, displayError } = params || {};
	if (!upiResponse.ok) {
		stopLoading();
		displayError({
			heading: 'Error',
			errorSubHeading: upiResponse.data?.message
		});
		throw new Error('');
	}
};

export const handleNetBankingResponse = (params) => {
	const { netBankingResponse, stopLoading, displayError, netBankingState } = params || {};
	if (isNetBakingPaymentWindowClosed(netBankingState)) {
		intializeNetBankingState(netBankingState);
		stopLoading();
		displayError({
			heading: 'Payment Cancelled',
			errorSubHeading:
				'You have cancelled your payment for this order. Please try again, or use another payment method'
		});
		throw new Error('');
	} else if (!netBankingResponse.ok) {
		intializeNetBankingState(netBankingState);
		stopLoading();
		displayError({
			heading: 'Error',
			errorSubHeading: netBankingResponse.data?.message || netBankingResponse.data?.data?.message
		});
		throw new Error('');
	}
};

export const handleOrderPostResponse = (params) => {
	const {
		orderPostResponse,
		previousOrderId,
		previousPGTxnId,
		resetState,
		stopLoading,
		displayError
	} = params;
	if (orderPostResponse.ok) {
		orderDeletePatchFunc({
			orderId: previousOrderId,
			pgTxnId: previousPGTxnId
		});
	} else {
		resetState();
		stopLoading();
		displayError({
			heading: 'Error',
			errorSubHeading: orderPostResponse?.data?.message
		});
		throw new Error('');
	}
};

export const handleOrderPatchResponse = (params) => {
	const { orderPatchResponse, stopLoading, displayError, orderId } = params || {};
	if (!orderPatchResponse.ok) {
		stopLoading();
		displayError({
			type: 'PATCH_FAILED',
			orderId,
			heading: 'Order Creation Error',
			errorSubHeading: orderPatchResponse?.data?.message
		});
		throw new Error('');
	}
};
