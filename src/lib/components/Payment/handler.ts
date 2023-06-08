import { orderDeletePatchFunc } from './api';
import { intializeNetBankingState, isNetBakingPaymentWindowClosed } from './util';

export const handleTransactionResponse = (params) => {
	const {
		transactionResponse,
		stopLoading,
		displayError,
		displayPendingPopup,
		transactionFailedAnalytics,
		orderId, // for lumpsum
		sipId, // for sip
		failureCallback
	} = params;
	if (transactionResponse.ok) {
		if (transactionResponse.data?.data?.status === 'failure') {
			transactionFailedAnalytics();
			stopLoading();
			failureCallback();
			displayError({
				orderId,
				sipId,
				heading: 'Payment Failed',
				errorSubHeading:
					transactionResponse?.data?.data?.response_description ||
					'If money has been debited from your bank account, please do not worry. It will be refunded automatically'
			});
			throw new Error('');
		} else if (transactionResponse.data?.data?.status === 'pending') {
			stopLoading();
			displayPendingPopup({
				orderId,
				sipId,
				heading: 'Payment Pending',
				errorSubHeading:
					transactionResponse?.data?.data?.response_description ||
					"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
			});
			throw new Error('');
		}
	} else {
		stopLoading();
		displayPendingPopup({
			orderId,
			sipId,
			heading: 'Payment Pending',
			errorSubHeading:
				transactionResponse?.data?.data?.response_description ||
				"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
		});
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
			orderId,
			heading: 'Order Creation Error',
			errorSubHeading: orderPatchResponse?.data?.message
		});
		throw new Error('');
	}
};
