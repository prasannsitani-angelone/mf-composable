import {
	cartPatchFunction,
	cartPostFunction,
	getEmandateDataFunc,
	initiateNetBankingPaymentFunc,
	initiateUPIPayment,
	initiateWalletPayment,
	lumpsumOrderPatchFunc,
	lumpsumOrderPostFunction,
	sipOrderPatchFunc,
	sipOrderPostFunction,
	upiValidateFunc
} from './api';
import {
	handleEmandateResponse,
	handleNetBankingResponse,
	handleOrderPatchResponse,
	handleOrderPostResponse,
	handleTransactionResponse,
	handleUPIResponse,
	handleUPIValidationResponse
} from './handler';
import { getPrimaryAccountMandateData } from '$lib/utils/helpers/emandate';
import {
	googlePayCloseLogic,
	initializeGPayState,
	intializeNetBankingState,
	isNetBakingPaymentWindowClosed,
	netBankingWindowCloseLogic,
	resetTransactionInterval,
	transactionRetryLogic,
	upiWindowCloseLogic
} from './util';
import { base } from '$app/paths';
import { initializeUPIState } from './util';

export const noPaymentFlow = async (params) => {
	const {
		amount,
		dpNumber,
		schemeCode,
		sipFrequency,
		sipMaxInstallmentNo,
		sipDate,
		xRequestId,
		source = '',
		previousOrderId = '', // for previous order deletion
		previousPGTxnId = '', // for previous order deletion
		stopLoading,
		displayError,
		showLoading,
		onSuccess
	} = params || {};
	try {
		showLoading('Getting Mandate Data');
		const emandateResponse = await getEmandateDataFunc({
			amount,
			sipDate
		});
		handleEmandateResponse({
			emandateResponse,
			stopLoading,
			displayError,
			resetState: () => undefined
		});
		showLoading('Creating your order');
		const orderPostResponse = await sipOrderPostFunction({
			amount,
			dpNumber,
			schemeCode,
			emandateId: getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || '',
			transactionRefNumber: '',
			sipFrequency,
			sipMaxInstallmentNo,
			firstSipPayment: false,
			sipDate,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			previousOrderId,
			previousPGTxnId,
			resetState: () => undefined,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse.data?.data?.orderId,
			sipId: orderPostResponse.data?.data?.sipId
		});
	} catch (e) {
		stopLoading();
	}
};

export const netBankingCartFlow = async (params) => {
	const {
		amount,
		accNO,
		ifscCode,
		bankName,
		fullName,
		cartItemIds = [],
		paymentMode,
		xRequestId,
		source = '',
		netBankingState,
		state,
		showLoading,
		stopLoading,
		displayPendingPopup,
		displayError,
		onSuccess,
		transactionFailedAnalytics = () => undefined
	} = params || {};
	try {
		netBankingState.paymentWindow = window.open(
			`${window.location.origin}${base}/intermediateLoading`,
			'PAYMENT_WINDOW'
		);
		showLoading('Redirecting to your Bank');
		const netBankingResponse = await initiateNetBankingPaymentFunc({
			amount,
			accNO,
			ifscCode,
			bankName,
			fullName,
			xRequestId,
			source
		});
		handleNetBankingResponse({
			netBankingResponse,
			stopLoading,
			displayError,
			netBankingState
		});
		showLoading('Creating your order');
		const orderPostResponse = await cartPostFunction({
			accNO,
			bankName,
			cartItemIds,
			paymentMode,
			transactionRefNumber: netBankingResponse.data?.data?.transaction_id,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			resetState: () => intializeNetBankingState(netBankingState),
			stopLoading,
			displayError
		});
		if (isNetBakingPaymentWindowClosed(netBankingState)) {
			intializeNetBankingState(netBankingState);
			stopLoading();
			displayError({
				heading: 'Payment Cancelled',
				errorSubHeading:
					'You have cancelled your payment for this order. Please try again, or use another payment method'
			});
			throw new Error('');
		}
		netBankingState.paymentWindow.location.replace(netBankingResponse.data?.data?.redirect_url);
		showLoading('Waiting for payment');
		await netBankingWindowCloseLogic({
			netBankingState,
			resetState: () => intializeNetBankingState(netBankingState)
		});
		showLoading('Checking Payment status');
		const transactionResponse = await transactionRetryLogic({
			transactionID: netBankingResponse.data?.data?.transaction_id,
			retryNumber: 0,
			retries: 5,
			retryDelay: 1,
			xRequestId,
			source,
			resetState: () => {
				resetTransactionInterval(state);
				intializeNetBankingState(netBankingState);
			},
			state
		});
		const cartPatch = () =>
			cartPatchFunction({
				accNO,
				bankName,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				reference_number: transactionResponse?.data?.data?.reference_number,
				orderId: orderPostResponse?.data?.orderId,
				xRequestId,
				source
			});
		handleTransactionResponse({
			transactionResponse,
			stopLoading,
			displayError,
			displayPendingPopup,
			transactionFailedAnalytics,
			orderId: orderPostResponse?.data?.orderId,
			failureCallback: cartPatch
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await cartPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse.data?.orderId
		});
	} catch (e) {
		stopLoading();
	}
};

export const netBankingLumpsumFlow = async (params) => {
	const {
		amount,
		accNO,
		ifscCode,
		bankName,
		dpNumber,
		fullName,
		email,
		subBroker,
		mobile,
		poaStatus,
		schemeCode,
		xRequestId,
		source = '',
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		netBankingState,
		state,
		showLoading,
		stopLoading,
		displayPendingPopup,
		displayError,
		onSuccess,
		transactionFailedAnalytics
	} = params || {};
	try {
		netBankingState.paymentWindow = window.open(
			`${window.location.origin}${base}/intermediateLoading`,
			'PAYMENT_WINDOW'
		);
		showLoading('Redirecting to your Bank');
		const netBankingResponse = await initiateNetBankingPaymentFunc({
			amount,
			accNO,
			ifscCode,
			bankName,
			fullName,
			xRequestId,
			source
		});
		handleNetBankingResponse({
			netBankingResponse,
			stopLoading,
			displayError,
			netBankingState
		});
		showLoading('Creating your order');
		const orderPostResponse = await lumpsumOrderPostFunction({
			amount,
			accNO,
			bankName,
			dpNumber,
			email,
			subBroker,
			mobile,
			poaStatus,
			schemeCode,
			transactionRefNumber: netBankingResponse.data?.data?.transaction_id,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			previousOrderId,
			previousPGTxnId,
			resetState: () => intializeNetBankingState(netBankingState),
			stopLoading,
			displayError
		});
		if (isNetBakingPaymentWindowClosed(netBankingState)) {
			intializeNetBankingState(netBankingState);
			stopLoading();
			displayError({
				heading: 'Payment Cancelled',
				errorSubHeading:
					'You have cancelled your payment for this order. Please try again, or use another payment method'
			});
			throw new Error('');
		}
		netBankingState.paymentWindow.location.replace(netBankingResponse.data?.data?.redirect_url);
		showLoading('Waiting for payment');
		await netBankingWindowCloseLogic({
			netBankingState,
			resetState: () => intializeNetBankingState(netBankingState)
		});
		showLoading('Checking Payment status');
		const transactionResponse = await transactionRetryLogic({
			transactionID: netBankingResponse.data?.data?.transaction_id,
			retryNumber: 0,
			retries: 5,
			retryDelay: 1,
			xRequestId,
			source,
			resetState: () => {
				resetTransactionInterval(state);
				intializeNetBankingState(netBankingState);
			},
			state
		});
		const orderPatch = () =>
			lumpsumOrderPatchFunc({
				reference_number: transactionResponse?.data?.data?.reference_number,
				response_description: transactionResponse?.data?.data?.response_description,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				orderId: orderPostResponse?.data?.data?.orderId,
				xRequestId,
				source
			});
		handleTransactionResponse({
			transactionResponse,
			stopLoading,
			displayError,
			displayPendingPopup,
			transactionFailedAnalytics,
			orderId: orderPostResponse?.data?.data?.orderId,
			failureCallback: orderPatch
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse.data?.data?.orderId
		});
	} catch (e) {
		stopLoading();
	}
};

export const netBankingSIPFlow = async (params) => {
	const {
		amount,
		accNO,
		sipFrequency,
		sipMaxInstallmentNo,
		sipDate,
		ifscCode,
		bankName,
		dpNumber,
		fullName,
		schemeCode,
		xRequestId,
		source = '',
		previousOrderId = '', // for previous order deletion
		previousPGTxnId = '', // for previous order deletion
		state,
		netBankingState,
		showLoading,
		stopLoading,
		displayPendingPopup,
		displayError,
		onSuccess,
		transactionFailedAnalytics
	} = params || {};
	try {
		netBankingState.paymentWindow = window.open(
			`${window.location.origin}${base}/intermediateLoading`,
			'PAYMENT_WINDOW'
		);
		showLoading('Getting Mandate Data');
		const emandateResponse = await getEmandateDataFunc({
			amount,
			sipDate
		});
		handleEmandateResponse({
			emandateResponse,
			stopLoading,
			displayError,
			resetState: () => intializeNetBankingState(netBankingState)
		});
		showLoading('Redirecting to your Bank');
		const netBankingResponse = await initiateNetBankingPaymentFunc({
			amount,
			accNO,
			ifscCode,
			bankName,
			fullName,
			xRequestId,
			source
		});
		handleNetBankingResponse({
			netBankingResponse,
			stopLoading,
			displayError,
			netBankingState
		});
		showLoading('Creating your order');
		const orderPostResponse = await sipOrderPostFunction({
			amount,
			dpNumber,
			schemeCode,
			emandateId: getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || '',
			transactionRefNumber: netBankingResponse.data?.data?.transaction_id,
			sipFrequency,
			sipMaxInstallmentNo,
			firstSipPayment: true,
			sipDate,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			previousOrderId,
			previousPGTxnId,
			resetState: () => intializeNetBankingState(netBankingState),
			stopLoading,
			displayError
		});
		if (isNetBakingPaymentWindowClosed(netBankingState)) {
			intializeNetBankingState(netBankingState);
			stopLoading();
			displayError({
				heading: 'Payment Cancelled',
				errorSubHeading:
					'You have cancelled your payment for this order. Please try again, or use another payment method'
			});
			throw new Error('');
		}
		netBankingState.paymentWindow.location.replace(netBankingResponse.data?.data?.redirect_url);
		showLoading('Waiting for payment');
		await netBankingWindowCloseLogic({
			netBankingState,
			resetState: () => intializeNetBankingState(netBankingState)
		});
		showLoading('Checking Payment status');
		const transactionResponse = await transactionRetryLogic({
			transactionID: netBankingResponse.data?.data?.transaction_id,
			retryNumber: 0,
			retries: 5,
			retryDelay: 1,
			xRequestId,
			source,
			resetState: () => {
				resetTransactionInterval(state);
				intializeNetBankingState(netBankingState);
			},
			state
		});
		const orderPatch = () =>
			sipOrderPatchFunc({
				reference_number: transactionResponse?.data?.data?.reference_number,
				response_description: transactionResponse?.data?.data?.response_description,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				sipId: orderPostResponse?.data?.data?.sipId,
				xRequestId,
				source
			});
		handleTransactionResponse({
			transactionResponse,
			stopLoading,
			displayError,
			displayPendingPopup,
			transactionFailedAnalytics,
			orderId: orderPostResponse?.data?.data?.orderId,
			sipId: orderPostResponse?.data?.data?.sipId,
			failureCallback: orderPatch
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse.data?.data?.orderId,
			sipId: orderPostResponse.data?.data?.sipId
		});
	} catch (e) {
		stopLoading();
	}
};

export const upiCartFlow = async (params) => {
	const {
		cartItemIds = [],
		paymentMode,
		amount,
		accNO,
		ifscCode,
		fullName,
		inputId,
		bankName,
		xRequestId,
		source = '',
		upiState,
		state,
		showUPILoading,
		stopUPILoading,
		showLoading,
		stopLoading,
		displayError,
		updateUPITimer,
		onUPIValidationFailure,
		displayPendingPopup,
		transactionFailedAnalytics = () => undefined,
		onSuccess
	} = params || {};
	try {
		const upiValidationResponse = await upiValidateFunc({
			bankName,
			id: inputId,
			xRequestId,
			source,
			showLoading: showUPILoading,
			stopLoading: stopUPILoading
		});
		handleUPIValidationResponse({
			upiValidationResponse,
			onUPIValidationFailure
		});
		showLoading('Initiating UPI Payment');
		const upiResponse = await initiateUPIPayment({
			amount,
			accNO,
			bankName,
			ifscCode,
			fullName,
			upiId: inputId,
			xRequestId,
			source
		});
		handleUPIResponse({
			upiResponse,
			stopLoading,
			displayError
		});
		showLoading('Creating your order');
		const orderPostResponse = await cartPostFunction({
			accNO,
			bankName,
			cartItemIds,
			paymentMode,
			transactionRefNumber: upiResponse.data?.data?.transaction_id,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			resetState: () => initializeUPIState(upiState),
			stopLoading,
			displayError
		});
		stopLoading();
		upiState.flow = 2;
		upiState.timer = upiResponse.data?.data?.transaction_validity * 60;
		upiState.timerInterval = setInterval(() => {
			if (upiState.timer <= 0) {
				clearInterval(upiState.timerInterval);
			}
			updateUPITimer(upiState.timer - 1);
		}, 1000);
		const promiseResponse = await Promise.any([
			transactionRetryLogic({
				transactionID: upiResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: Math.ceil(upiState.timer / 3),
				retryDelay: 3,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				},
				state
			}),
			upiWindowCloseLogic({
				upiState,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				}
			})
		]);
		let transactionResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for payment');
			transactionResponse = await transactionRetryLogic({
				transactionID: upiResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: 5,
				retryDelay: 1,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				},
				state
			});
		} else {
			transactionResponse = promiseResponse;
		}
		const orderPatch = () =>
			cartPatchFunction({
				orderId: orderPostResponse?.data?.orderId,
				accNO,
				bankName,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				reference_number: transactionResponse?.data?.data?.reference_number,
				xRequestId,
				source
			});
		handleTransactionResponse({
			transactionResponse,
			stopLoading,
			displayError,
			displayPendingPopup,
			transactionFailedAnalytics,
			orderId: orderPostResponse?.data?.orderId,
			failureCallback: orderPatch
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse?.data?.orderId
		});
	} catch (e) {
		stopLoading();
	}
};

export const upiLumpsumFlow = async (params) => {
	const {
		amount,
		accNO,
		ifscCode,
		fullName,
		dpNumber,
		email,
		subBroker,
		mobile,
		poaStatus,
		schemeCode,
		inputId,
		bankName,
		xRequestId,
		source = '',
		sipId, // for sip installments
		sipDueDate, // for sip installments
		redirectedFrom, // for sip installments
		sipRegistrationNumber, // for sip installments
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		upiState,
		state,
		showUPILoading,
		stopUPILoading,
		showLoading,
		stopLoading,
		displayError,
		updateUPITimer,
		onUPIValidationFailure,
		displayPendingPopup,
		transactionFailedAnalytics,
		onSuccess
	} = params || {};
	try {
		const upiValidationResponse = await upiValidateFunc({
			bankName,
			id: inputId,
			xRequestId,
			source,
			showLoading: showUPILoading,
			stopLoading: stopUPILoading
		});
		handleUPIValidationResponse({
			upiValidationResponse,
			onUPIValidationFailure
		});
		showLoading('Initiating UPI Payment');
		const upiResponse = await initiateUPIPayment({
			amount,
			accNO,
			bankName,
			ifscCode,
			fullName,
			upiId: inputId,
			redirectedFrom,
			sipRegistrationNumber,
			xRequestId,
			source
		});
		handleUPIResponse({
			upiResponse,
			stopLoading,
			displayError
		});
		showLoading('Creating your order');
		const orderPostResponse = await lumpsumOrderPostFunction({
			amount,
			accNO,
			bankName,
			dpNumber,
			email,
			subBroker,
			mobile,
			poaStatus,
			schemeCode,
			redirectedFrom,
			transactionRefNumber: upiResponse.data?.data?.transaction_id,
			sipId,
			sipDueDate,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			previousOrderId,
			previousPGTxnId,
			resetState: () => initializeUPIState(upiState),
			stopLoading,
			displayError
		});
		stopLoading();
		upiState.flow = 2;
		upiState.timer = upiResponse.data?.data?.transaction_validity * 60;
		upiState.timerInterval = setInterval(() => {
			if (upiState.timer <= 0) {
				clearInterval(upiState.timerInterval);
			}
			updateUPITimer(upiState.timer - 1);
		}, 1000);
		const promiseResponse = await Promise.any([
			transactionRetryLogic({
				transactionID: upiResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: Math.ceil(upiState.timer / 3),
				retryDelay: 3,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				},
				state
			}),
			upiWindowCloseLogic({
				upiState,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				}
			})
		]);
		let transactionResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for payment');
			transactionResponse = await transactionRetryLogic({
				transactionID: upiResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: 5,
				retryDelay: 1,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				},
				state
			});
		} else {
			transactionResponse = promiseResponse;
		}
		const orderPatch = () =>
			lumpsumOrderPatchFunc({
				reference_number: transactionResponse?.data?.data?.reference_number,
				response_description: transactionResponse?.data?.data?.response_description,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				orderId: orderPostResponse?.data?.data?.orderId,
				xRequestId,
				source
			});
		handleTransactionResponse({
			transactionResponse,
			stopLoading,
			displayError,
			displayPendingPopup,
			transactionFailedAnalytics,
			orderId: orderPostResponse?.data?.data?.orderId,
			failureCallback: orderPatch
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse.data?.data?.orderId
		});
	} catch (e) {
		stopLoading();
	}
};

export const upiSIPFlow = async (params) => {
	const {
		amount,
		sipDate,
		accNO,
		ifscCode,
		fullName,
		dpNumber,
		sipFrequency,
		sipMaxInstallmentNo,
		schemeCode,
		inputId,
		bankName,
		xRequestId,
		source = '',
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		upiState,
		state,
		showUPILoading,
		stopUPILoading,
		showLoading,
		stopLoading,
		displayError,
		updateUPITimer,
		onUPIValidationFailure,
		displayPendingPopup,
		transactionFailedAnalytics,
		onSuccess
	} = params || {};
	try {
		const upiValidationResponse = await upiValidateFunc({
			bankName,
			id: inputId,
			xRequestId,
			source,
			showLoading: showUPILoading,
			stopLoading: stopUPILoading
		});
		handleUPIValidationResponse({
			upiValidationResponse,
			onUPIValidationFailure
		});
		showLoading('Getting Mandate Data');
		const emandateResponse = await getEmandateDataFunc({
			amount,
			sipDate
		});
		handleEmandateResponse({
			emandateResponse,
			stopLoading,
			displayError,
			resetState: () => {
				initializeUPIState(upiState);
			}
		});
		showLoading('Initiating UPI Payment');
		const upiResponse = await initiateUPIPayment({
			amount,
			accNO,
			bankName,
			ifscCode,
			fullName,
			upiId: inputId,
			xRequestId,
			source
		});
		handleUPIResponse({
			upiResponse,
			stopLoading,
			displayError
		});
		showLoading('Creating your order');
		const orderPostResponse = await sipOrderPostFunction({
			amount,
			dpNumber,
			schemeCode,
			emandateId: getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || '',
			transactionRefNumber: upiResponse.data?.data?.transaction_id,
			sipFrequency,
			sipMaxInstallmentNo,
			firstSipPayment: true,
			sipDate,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			previousOrderId,
			previousPGTxnId,
			resetState: () => {
				initializeUPIState(upiState);
			},
			stopLoading,
			displayError
		});
		stopLoading();
		upiState.flow = 2;
		upiState.timer = upiResponse.data?.data?.transaction_validity * 60;
		upiState.timerInterval = setInterval(() => {
			if (upiState.timer <= 0) {
				clearInterval(upiState.timerInterval);
			}
			updateUPITimer(upiState.timer - 1);
		}, 1000);
		const promiseResponse = await Promise.any([
			transactionRetryLogic({
				transactionID: upiResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: Math.ceil(upiState.timer / 3),
				retryDelay: 3,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				},
				state
			}),
			upiWindowCloseLogic({
				upiState,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				}
			})
		]);
		let transactionResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for payment');
			transactionResponse = await transactionRetryLogic({
				transactionID: upiResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: 5,
				retryDelay: 1,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				},
				state
			});
		} else {
			transactionResponse = promiseResponse;
		}
		const orderPatch = () =>
			sipOrderPatchFunc({
				reference_number: transactionResponse?.data?.data?.reference_number,
				response_description: transactionResponse?.data?.data?.response_description,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				sipId: orderPostResponse?.data?.data?.sipId,
				xRequestId,
				source
			});
		handleTransactionResponse({
			transactionResponse,
			stopLoading,
			displayError,
			displayPendingPopup,
			transactionFailedAnalytics,
			orderId: orderPostResponse?.data?.orderId,
			sipId: orderPostResponse?.data?.data?.sipId,
			failureCallback: orderPatch
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse.data?.data?.orderId,
			sipId: orderPostResponse.data?.data?.sipId
		});
	} catch (e) {
		stopLoading();
	}
};

export const walletCartFlow = async (params) => {
	const {
		cartItemIds = [],
		paymentMode,
		paymentModeName,
		paymentModeAPIName,
		amount,
		accNO,
		ifscCode,
		fullName,
		bankName,
		xRequestId,
		source = '',
		gpayPaymentState,
		state,
		showLoading,
		stopLoading,
		displayError,
		displayPendingPopup,
		transactionFailedAnalytics,
		onSuccess
	} = params || {};
	try {
		showLoading(`Redirecting to ${paymentModeName}`);
		const walletResponse = await initiateWalletPayment({
			amount,
			accNO,
			bankName,
			ifscCode,
			fullName,
			xRequestId,
			source,
			apiName: paymentModeAPIName
		});
		handleUPIResponse({
			upiResponse: walletResponse,
			stopLoading,
			displayError
		});
		showLoading('Creating your order');
		const orderPostResponse = await cartPostFunction({
			accNO,
			bankName,
			cartItemIds,
			paymentMode,
			transactionRefNumber: walletResponse.data?.data?.transaction_id,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			resetState: () => initializeGPayState(gpayPaymentState),
			stopLoading,
			displayError
		});
		const redirectUrl = walletResponse.data?.data?.ios_deeplink_url;
		showLoading('Waiting for payment');
		window.open(redirectUrl, '_self');
		const promiseResponse = await Promise.any([
			transactionRetryLogic({
				transactionID: walletResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: Math.ceil((walletResponse.data?.data?.transaction_validity * 60) / 3),
				retryDelay: 3,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				state
			}),
			googlePayCloseLogic({
				gpayPaymentState,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				paymentModeName,
				showLoading
			})
		]);
		let transactionResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for payment');
			transactionResponse = await transactionRetryLogic({
				transactionID: walletResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: 5,
				retryDelay: 1,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				state
			});
		} else {
			transactionResponse = promiseResponse;
		}
		const orderPatch = () =>
			cartPatchFunction({
				orderId: orderPostResponse?.data?.orderId,
				accNO,
				bankName,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				reference_number: transactionResponse?.data?.data?.reference_number,
				xRequestId,
				source
			});
		handleTransactionResponse({
			transactionResponse,
			stopLoading,
			displayError,
			displayPendingPopup,
			transactionFailedAnalytics,
			orderId: orderPostResponse?.data?.orderId,
			failureCallback: orderPatch
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse?.data?.orderId
		});
	} catch (e) {
		stopLoading();
	}
};

export const walletLumpsumFlow = async (params) => {
	const {
		paymentModeName,
		paymentModeAPIName,
		amount,
		accNO,
		ifscCode,
		fullName,
		dpNumber,
		email,
		subBroker,
		mobile,
		poaStatus,
		schemeCode,
		bankName,
		xRequestId,
		source = '',
		sipId, // for sip installments
		sipDueDate, // for sip installments
		redirectedFrom, // for sip installments
		sipRegistrationNumber, // for sip installments
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		gpayPaymentState,
		state,
		showLoading,
		stopLoading,
		displayError,
		displayPendingPopup,
		transactionFailedAnalytics,
		onSuccess
	} = params || {};
	try {
		showLoading(`Redirecting to ${paymentModeName}`);
		const walletResponse = await initiateWalletPayment({
			amount,
			accNO,
			bankName,
			ifscCode,
			fullName,
			redirectedFrom,
			sipRegistrationNumber,
			xRequestId,
			source,
			apiName: paymentModeAPIName
		});
		handleUPIResponse({
			upiResponse: walletResponse,
			stopLoading,
			displayError
		});
		showLoading('Creating your order');
		const orderPostResponse = await lumpsumOrderPostFunction({
			amount,
			accNO,
			bankName,
			dpNumber,
			email,
			subBroker,
			mobile,
			poaStatus,
			schemeCode,
			redirectedFrom,
			transactionRefNumber: walletResponse.data?.data?.transaction_id,
			sipId,
			sipDueDate,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			previousOrderId,
			previousPGTxnId,
			resetState: () => initializeGPayState(gpayPaymentState),
			stopLoading,
			displayError
		});
		const redirectUrl = walletResponse.data?.data?.ios_deeplink_url;
		showLoading('Waiting for payment');
		window.open(redirectUrl, '_self');
		const promiseResponse = await Promise.any([
			transactionRetryLogic({
				transactionID: walletResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: Math.ceil((walletResponse.data?.data?.transaction_validity * 60) / 3),
				retryDelay: 3,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				state
			}),
			googlePayCloseLogic({
				gpayPaymentState,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				paymentModeName,
				showLoading
			})
		]);
		let transactionResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for payment');
			transactionResponse = await transactionRetryLogic({
				transactionID: walletResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: 5,
				retryDelay: 1,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				state
			});
		} else {
			transactionResponse = promiseResponse;
		}
		const orderPatch = () =>
			lumpsumOrderPatchFunc({
				reference_number: transactionResponse?.data?.data?.reference_number,
				response_description: transactionResponse?.data?.data?.response_description,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				orderId: orderPostResponse?.data?.data?.orderId,
				xRequestId,
				source
			});
		handleTransactionResponse({
			transactionResponse,
			stopLoading,
			displayError,
			displayPendingPopup,
			transactionFailedAnalytics,
			orderId: orderPostResponse?.data?.data?.orderId,
			failureCallback: orderPatch
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse.data?.data?.orderId
		});
	} catch (e) {
		stopLoading();
	}
};

export const walletSIPFlow = async (params) => {
	const {
		paymentModeName,
		paymentModeAPIName,
		amount,
		sipDate,
		accNO,
		ifscCode,
		fullName,
		dpNumber,
		sipFrequency,
		sipMaxInstallmentNo,
		schemeCode,
		bankName,
		xRequestId,
		source = '',
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		gpayPaymentState,
		state,
		showLoading,
		stopLoading,
		displayError,
		displayPendingPopup,
		transactionFailedAnalytics,
		onSuccess
	} = params || {};
	try {
		showLoading('Getting Mandate Data');
		const emandateResponse = await getEmandateDataFunc({
			amount,
			sipDate
		});
		handleEmandateResponse({
			emandateResponse,
			stopLoading,
			displayError,
			resetState: () => initializeGPayState(gpayPaymentState)
		});
		showLoading(`Redirecting to ${paymentModeName}`);
		const walletResponse = await initiateWalletPayment({
			amount,
			accNO,
			bankName,
			ifscCode,
			fullName,
			xRequestId,
			source,
			apiName: paymentModeAPIName
		});
		handleUPIResponse({
			upiResponse: walletResponse,
			stopLoading,
			displayError
		});
		showLoading('Creating your order');
		const orderPostResponse = await sipOrderPostFunction({
			amount,
			dpNumber,
			schemeCode,
			emandateId: getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || '',
			transactionRefNumber: walletResponse.data?.data?.transaction_id,
			sipFrequency,
			sipMaxInstallmentNo,
			firstSipPayment: true,
			sipDate,
			xRequestId,
			source
		});
		handleOrderPostResponse({
			orderPostResponse,
			previousOrderId,
			previousPGTxnId,
			resetState: () => initializeGPayState(gpayPaymentState),
			stopLoading,
			displayError
		});
		const redirectUrl = walletResponse.data?.data?.ios_deeplink_url;
		showLoading('Waiting for payment');
		window.open(redirectUrl, '_self');
		const promiseResponse = await Promise.any([
			transactionRetryLogic({
				transactionID: walletResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: Math.ceil((walletResponse.data?.data?.transaction_validity * 60) / 3),
				retryDelay: 3,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				state
			}),
			googlePayCloseLogic({
				gpayPaymentState,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				paymentModeName,
				showLoading
			})
		]);
		let transactionResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for payment');
			transactionResponse = await transactionRetryLogic({
				transactionID: walletResponse.data?.data?.transaction_id,
				retryNumber: 0,
				retries: 5,
				retryDelay: 1,
				xRequestId,
				source,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				state
			});
		} else {
			transactionResponse = promiseResponse;
		}
		const orderPatch = () =>
			sipOrderPatchFunc({
				reference_number: transactionResponse?.data?.data?.reference_number,
				response_description: transactionResponse?.data?.data?.response_description,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				sipId: orderPostResponse?.data?.data?.sipId,
				xRequestId,
				source
			});
		handleTransactionResponse({
			transactionResponse,
			stopLoading,
			displayError,
			displayPendingPopup,
			transactionFailedAnalytics,
			orderId: orderPostResponse?.data?.orderId,
			sipId: orderPostResponse?.data?.data?.sipId,
			failureCallback: orderPatch
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse.data?.data?.orderId,
			sipId: orderPostResponse.data?.data?.sipId
		});
	} catch (e) {
		stopLoading();
	}
};
