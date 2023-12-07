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
	upiValidateFunc,
	sipBulkPatchFunc,
	sipBulkPostFunction
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
import {
	handleEmandateResponse as handleMandateResponse,
	handleTransactionResponse as handleMandateStatusResponse
} from '../mandate/handlers';
import { getSipEndDate, transactionRetryLogic as mandateStatusRetryLogic } from '../mandate/utils';
import { getPrimaryAccountMandateData } from '$lib/utils/helpers/emandate';
import {
	googlePayCloseLogic,
	initializeGPayState,
	intializeNetBankingState,
	isNetBakingPaymentWindowClosed,
	mandateTransactionRetryLogic,
	netBankingWindowCloseLogic,
	resetTransactionInterval,
	transactionRetryLogic,
	upiWindowCloseLogic
} from './util';
import { base } from '$app/paths';
import { initializeUPIState } from './util';
import { callMandateAPI } from '$components/mandate/api';
import { PUBLIC_MANDATE_SOURCE } from '$env/static/public';
import { addCommasToAmountString } from 'svelte-components';

export const noPaymentFlow = async (params) => {
	const {
		amount,
		dpNumber,
		schemeCode,
		sipFrequency,
		sipMaxInstallmentNo,
		sipDate,
		xRequestId,
		sipType = 'SIP',
		source = '',
		previousOrderId = '', // for previous order deletion
		previousPGTxnId = '', // for previous order deletion
		stopLoading = () => undefined,
		displayError = () => undefined,
		showLoading = () => undefined,
		onSuccess = () => undefined
	} = params || {};
	try {
		showLoading('Getting Mandate Data');
		const emandateResponse = await getEmandateDataFunc({
			amount,
			sipDate,
			source
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
			sipType,
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
		netBankingState = {},
		state = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayPendingPopup = () => undefined,
		displayError = () => undefined,
		onStart = () => undefined,
		onSuccess = () => undefined
	} = params || {};
	try {
		onStart();
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
		const orderPatch = () =>
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: async () => {
				const orderPatchResponse = await orderPatch();
				stopLoading();
				displayError({
					type: orderPatchResponse.ok ? 'PAYMENT_FAILED' : 'PAYMENT_PATCH_FAILED',
					orderId: orderPostResponse?.data?.orderId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					orderId: orderPostResponse?.data?.orderId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderId: orderPostResponse?.data?.orderId,
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
		redirectedFrom, // for redirection
		isAdditional,
		netBankingState = {},
		state = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayPendingPopup = () => undefined,
		displayError = () => undefined,
		onSuccess = () => undefined
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
			redirectedFrom,
			transactionRefNumber: netBankingResponse.data?.data?.transaction_id,
			xRequestId,
			source,
			isAdditional
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				orderPatch();
				displayError({
					type: 'PAYMENT_FAILED',
					orderId: orderPostResponse?.data?.data?.orderId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					orderId: orderPostResponse?.data?.data?.orderId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
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
		mandateId = '',
		previousOrderId = '', // for previous order deletion
		previousPGTxnId = '', // for previous order deletion
		state = {},
		netBankingState = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayPendingPopup = () => undefined,
		displayError = () => undefined,
		onSuccess = () => undefined
	} = params || {};
	let { sipType = 'SIP' } = params || {};
	try {
		netBankingState.paymentWindow = window.open(
			`${window.location.origin}${base}/intermediateLoading`,
			'PAYMENT_WINDOW'
		);
		let autoMandate;
		if (!mandateId) {
			showLoading('Getting Mandate Data');
			const emandateResponse = await getEmandateDataFunc({
				amount,
				sipDate,
				source
			});
			handleEmandateResponse({
				emandateResponse,
				stopLoading,
				displayError,
				resetState: () => intializeNetBankingState(netBankingState)
			});
			autoMandate = getPrimaryAccountMandateData(emandateResponse?.data);
			sipType = autoMandate?.mandateType;
		}
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
			sipType,
			emandateId: mandateId || autoMandate?.mandateId || '',
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				orderPatch();
				displayError({
					type: 'PAYMENT_FAILED',
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
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

export const netBankingBulkSIPFlow = async (params) => {
	const {
		amount,
		accNO,
		orders,
		packId,
		sipDate,
		ifscCode,
		bankName,
		dpNumber,
		fullName,
		xRequestId,
		source = '',
		previousOrderId = '', // for previous order deletion
		previousPGTxnId = '', // for previous order deletion
		state = {},
		netBankingState = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayPendingPopup = () => undefined,
		displayError = () => undefined,
		onSuccess = () => undefined
	} = params || {};
	try {
		netBankingState.paymentWindow = window.open(
			`${window.location.origin}${base}/intermediateLoading`,
			'PAYMENT_WINDOW'
		);
		showLoading('Getting Mandate Data');
		const emandateResponse = await getEmandateDataFunc({
			amount,
			sipDate,
			source
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
		const orderPostResponse = await sipBulkPostFunction({
			dpNumber,
			emandateId: getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || '',
			orders,
			packId,
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
			sipBulkPatchFunc({
				reference_number: transactionResponse?.data?.data?.reference_number,
				response_description: transactionResponse?.data?.data?.response_description,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId,
				xRequestId,
				source
			});
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				orderPatch();
				displayError({
					type: 'PAYMENT_FAILED',
					bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId
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
		upiState = {},
		state = {},
		showUPILoading = () => undefined,
		stopUPILoading = () => undefined,
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		updateUPITimer = () => undefined,
		onUPIValidationFailure = () => undefined,
		displayPendingPopup = () => undefined,
		onStart = () => undefined,
		onSuccess = () => undefined
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
		onStart();
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: async () => {
				const orderPatchResponse = await orderPatch();
				stopLoading();
				displayError({
					type: orderPatchResponse.ok ? 'PAYMENT_FAILED' : 'PAYMENT_PATCH_FAILED',
					orderId: orderPostResponse?.data?.orderId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					orderId: orderPostResponse?.data?.orderId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderId: orderPostResponse?.data?.orderId,
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
		sipRegistrationNumber, // for sip installments
		redirectedFrom, // for redirection
		sipInstalmentId,
		isAdditional,
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		upiState = {},
		state = {},
		showUPILoading = () => undefined,
		stopUPILoading = () => undefined,
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		updateUPITimer = () => undefined,
		onUPIValidationFailure = () => undefined,
		displayPendingPopup = () => undefined,
		onSuccess = () => undefined
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
			source,
			sipInstalmentId,
			isAdditional
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				orderPatch();
				displayError({
					type: 'PAYMENT_FAILED',
					orderId: orderPostResponse?.data?.data?.orderId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					orderId: orderPostResponse?.data?.data?.orderId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
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
		mandateId = '',
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		upiState = {},
		state = {},
		showUPILoading = () => undefined,
		stopUPILoading = () => undefined,
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		updateUPITimer = () => undefined,
		onUPIValidationFailure = () => undefined,
		displayPendingPopup = () => undefined,
		onSuccess = () => undefined,
		isFirstSip = false,
		upiIdValid = false
	} = params || {};
	let { sipType = 'SIP' } = params || {};
	try {
		// initiate only when we don't know upi id is valid or not
		if (!upiIdValid) {
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
		}

		// initiate only when we don't have mandate id
		let autoMandate;
		if (!mandateId) {
			showLoading('Getting Mandate Data');
			const emandateResponse = await getEmandateDataFunc({
				amount,
				sipDate,
				source
			});
			handleEmandateResponse({
				emandateResponse,
				stopLoading,
				displayError,
				resetState: () => {
					initializeUPIState(upiState);
				}
			});
			autoMandate = getPrimaryAccountMandateData(emandateResponse?.data);
			sipType = autoMandate?.mandateType;
		}

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
			sipType,
			emandateId: mandateId || autoMandate?.mandateId || '',
			transactionRefNumber: upiResponse.data?.data?.transaction_id,
			sipFrequency,
			sipMaxInstallmentNo,
			firstSipPayment: true,
			sipDate,
			xRequestId,
			source,
			isFirstSip
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				orderPatch();
				displayError({
					type: 'PAYMENT_FAILED',
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
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

export const upiIntegeratedFlow = async (params) => {
	const {
		mobile,
		clientId,
		accountType,
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
		mandateId = '',
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		upiState = {},
		state = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		updateUPITimer = () => undefined,
		displayPendingPopup = () => undefined,
		onSuccess = () => undefined,
		isFirstSip = false
	} = params || {};

	const { sipType = 'SIP' } = params || {};

	try {
		// creating order
		showLoading('Creating your order');
		const orderPostResponse = await sipOrderPostFunction({
			amount,
			dpNumber,
			schemeCode,
			sipType,
			emandateId: mandateId,
			sipFrequency,
			sipMaxInstallmentNo,
			firstSipPayment: true,
			sipDate,
			xRequestId,
			source,
			isFirstSip,
			integratedFlow: true
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

		// initiating integerated flow
		const currentDate = new Date();
		showLoading('Initiating UPI Payment');
		const mandateResponse = await callMandateAPI({
			client_full_name: fullName,
			client_mobile_number: mobile,
			client_code: clientId,
			bank_name: bankName,
			bank_account_number: accNO,
			bank_account_type: accountType || 'savings',
			bank_ifsc_code: ifscCode,
			type: 'upi',
			sub_type: 'collect',
			vpa: inputId,
			frequency: 'monthly',
			product: 'mf',
			amount: 15000,
			request_source: PUBLIC_MANDATE_SOURCE,
			start_date: currentDate.getTime(),
			end_date: getSipEndDate(currentDate),
			upfront_payment: {
				amount: amount,
				upstream_reference_number: xRequestId
			}
		});
		handleMandateResponse({
			response: mandateResponse,
			stopLoading,
			onError: displayError,
			resetState: () => initializeUPIState(upiState)
		});
		stopLoading();
		upiState.flow = 2;
		upiState.timer = 10 * 60; // hardcoding the tiner for upi to 10 minutes
		upiState.timerInterval = setInterval(() => {
			if (upiState.timer <= 0) {
				clearInterval(upiState.timerInterval);
			}
			updateUPITimer(upiState.timer - 1);
		}, 1000);

		// mandate status check
		const promiseResponse = await Promise.any([
			mandateStatusRetryLogic({
				mandateID: mandateResponse.data?.data?.mandate_id,
				retryNumber: 0,
				retries: Math.ceil((10 * 60) / 3), // hardcoding transaction validity
				retryDelay: 3,
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
		let mandateStatusResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for approval');
			mandateStatusResponse = await mandateStatusRetryLogic({
				mandateID: mandateResponse.data?.data?.mandate_id,
				retryNumber: 0,
				retries: 5,
				retryDelay: 1,
				resetState: () => {
					resetTransactionInterval(state);
					initializeUPIState(upiState);
				},
				state
			});
		} else {
			mandateStatusResponse = promiseResponse;
		}
		await handleMandateStatusResponse({
			transactionResponse: mandateStatusResponse,
			failureCallback: () => {
				stopLoading();
				displayError({
					heading: 'SIP Setup Failed',
					errorSubHeading:
						mandateStatusResponse?.data?.data?.response_description ||
						'We were unable to set up your autopay due to a technical issue. Please try again'
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					isIntegeratedFlow: true,
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: 'SIP Setup Pending',
					errorSubHeading:
						mandateStatusResponse?.data?.data?.response_description ||
						'You have cancelled the eMandate request for Autopay. Please try again or use another authorisation mode'
				});
			}
		});

		// transaction status check
		showLoading('Waiting for payment status');
		const transactionResponse = await mandateTransactionRetryLogic({
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				displayError({
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: 'SIP Setup Failed',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically'
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					isIntegeratedFlow: true,
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: 'SIP Setup Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
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
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			orderId: orderPostResponse.data?.data?.orderId,
			sipId: orderPostResponse.data?.data?.sipId,
			isIntegeratedFlow: true
		});
	} catch (e) {
		stopLoading();
	}
};

export const upiBulkSIPFlow = async (params) => {
	const {
		amount,
		sipDate,
		accNO,
		ifscCode,
		fullName,
		dpNumber,
		orders,
		packId,
		inputId,
		bankName,
		xRequestId,
		source = '',
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		upiState = {},
		state = {},
		showUPILoading = () => undefined,
		stopUPILoading = () => undefined,
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		updateUPITimer = () => undefined,
		onUPIValidationFailure = () => undefined,
		displayPendingPopup = () => undefined,
		onSuccess = () => undefined
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
			sipDate,
			source
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
		const orderPostResponse = await sipBulkPostFunction({
			dpNumber,
			emandateId: getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || '',
			orders,
			packId,
			transactionRefNumber: upiResponse.data?.data?.transaction_id,
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
			sipBulkPatchFunc({
				reference_number: transactionResponse?.data?.data?.reference_number,
				response_description: transactionResponse?.data?.data?.response_description,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId,
				xRequestId,
				source
			});
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				orderPatch();
				displayError({
					type: 'PAYMENT_FAILED',
					bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId
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
		gpayPaymentState = {},
		state = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		displayPendingPopup = () => undefined,
		onStart = () => undefined,
		onSuccess = () => undefined
	} = params || {};
	try {
		onStart();
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
				transactionRefNumber: walletResponse.data?.data?.transaction_id,
				xRequestId,
				source,
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: async () => {
				const orderPatchResponse = await orderPatch();
				stopLoading();
				displayError({
					type: orderPatchResponse.ok ? 'PAYMENT_FAILED' : 'PAYMENT_PATCH_FAILED',
					orderId: orderPostResponse?.data?.orderId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					orderId: orderPostResponse?.data?.orderId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderId: orderPostResponse?.data?.orderId,
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
		sipRegistrationNumber, // for sip installments
		redirectedFrom, // for redirection
		sipInstalmentId,
		isAdditional,
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		gpayPaymentState = {},
		state = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		displayPendingPopup = () => undefined,
		onSuccess = () => undefined
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
			source,
			sipInstalmentId,
			isAdditional
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
				transactionRefNumber: walletResponse.data?.data?.transaction_id,
				xRequestId,
				source,
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				orderPatch();
				displayError({
					type: 'PAYMENT_FAILED',
					orderId: orderPostResponse?.data?.data?.orderId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					orderId: orderPostResponse?.data?.data?.orderId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
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
		mandateId = '',
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		gpayPaymentState = {},
		state = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		displayPendingPopup = () => undefined,
		onSuccess = () => undefined,
		isFirstSip = false
	} = params || {};
	let { sipType = 'SIP' } = params || {};
	try {
		let autoMandate;
		if (!mandateId) {
			showLoading('Getting Mandate Data');
			const emandateResponse = await getEmandateDataFunc({
				amount,
				sipDate,
				source
			});
			handleEmandateResponse({
				emandateResponse,
				stopLoading,
				displayError,
				resetState: () => initializeGPayState(gpayPaymentState)
			});
			autoMandate = getPrimaryAccountMandateData(emandateResponse?.data);
			sipType = autoMandate?.mandateType;
		}
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
			sipType,
			emandateId: mandateId || autoMandate?.mandateId || '',
			transactionRefNumber: walletResponse.data?.data?.transaction_id,
			sipFrequency,
			sipMaxInstallmentNo,
			firstSipPayment: true,
			sipDate,
			xRequestId,
			source,
			isFirstSip
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
				transactionRefNumber: walletResponse.data?.data?.transaction_id,
				xRequestId,
				source,
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				orderPatch();
				displayError({
					type: 'PAYMENT_FAILED',
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
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

export const walletBulkSIPFlow = async (params) => {
	const {
		paymentModeName,
		paymentModeAPIName,
		amount,
		sipDate,
		accNO,
		ifscCode,
		fullName,
		dpNumber,
		orders,
		packId,
		bankName,
		xRequestId,
		source = '',
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		gpayPaymentState = {},
		state = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		displayPendingPopup = () => undefined,
		onSuccess = () => undefined
	} = params || {};
	try {
		showLoading('Getting Mandate Data');
		const emandateResponse = await getEmandateDataFunc({
			amount,
			sipDate,
			source
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
		const orderPostResponse = await sipBulkPostFunction({
			dpNumber,
			emandateId: getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || '',
			orders,
			packId,
			transactionRefNumber: walletResponse.data?.data?.transaction_id,
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
				transactionRefNumber: walletResponse.data?.data?.transaction_id,
				xRequestId,
				source,
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
			sipBulkPatchFunc({
				reference_number: transactionResponse?.data?.data?.reference_number,
				response_description: transactionResponse?.data?.data?.response_description,
				status: transactionResponse?.data?.data?.status,
				transaction_id: transactionResponse?.data?.data?.transaction_id,
				bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId,
				xRequestId,
				source
			});
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				orderPatch();
				displayError({
					type: 'PAYMENT_FAILED',
					bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
		});
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			bulkRequestId: orderPostResponse?.data?.data?.bulkRequestId
		});
	} catch (e) {
		stopLoading();
	}
};

export const walletIntegeratedFlow = async (params) => {
	const {
		mobile,
		clientId,
		accountType,
		os,
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
		mandateId = '',
		previousOrderId, // for previous order deletion
		previousPGTxnId, // for previous order deletion
		gpayPaymentState = {},
		state = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		displayError = () => undefined,
		displayPendingPopup = () => undefined,
		onSuccess = () => undefined,
		isFirstSip = false
	} = params || {};

	const { sipType = 'SIP' } = params || {};

	try {
		// creating order
		showLoading('Creating your order');
		const orderPostResponse = await sipOrderPostFunction({
			amount,
			dpNumber,
			schemeCode,
			sipType,
			emandateId: mandateId,
			sipFrequency,
			sipMaxInstallmentNo,
			firstSipPayment: true,
			sipDate,
			xRequestId,
			source,
			isFirstSip,
			integratedFlow: true
		});
		handleOrderPostResponse({
			orderPostResponse,
			previousOrderId,
			previousPGTxnId,
			resetState: () => initializeGPayState(gpayPaymentState),
			stopLoading,
			displayError
		});

		// initiating integerated flow
		showLoading(`Redirecting to ${paymentModeName}`);
		const currentDate = new Date();
		const mandateResponse = await callMandateAPI({
			client_full_name: fullName,
			client_mobile_number: mobile,
			client_code: clientId,
			bank_name: bankName,
			bank_account_number: accNO,
			bank_account_type: accountType || 'savings',
			bank_ifsc_code: ifscCode,
			type: 'upi',
			sub_type: 'intent',
			app_name: paymentModeAPIName?.toLowerCase(),
			frequency: 'monthly',
			product: 'mf',
			amount: 15000,
			request_source: PUBLIC_MANDATE_SOURCE,
			start_date: currentDate.getTime(),
			end_date: getSipEndDate(currentDate),
			upfront_payment: {
				amount: amount,
				upstream_reference_number: xRequestId
			}
		});
		handleMandateResponse({
			response: mandateResponse,
			stopLoading,
			onError: displayError,
			resetState: () => initializeGPayState(gpayPaymentState)
		});

		// redirection
		const redirectUrl = mandateResponse.data?.data?.[`${os?.toLowerCase() || ''}_deep_link`];
		showLoading('Waiting for approval');
		window.open(redirectUrl, '_self');

		// mandate status check
		const promiseResponse = await Promise.any([
			mandateStatusRetryLogic({
				mandateID: mandateResponse.data?.data?.mandate_id,
				retryNumber: 0,
				retries: Math.ceil((10 * 60) / 3), // hardcoding transaction validity
				retryDelay: 3,
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
		let mandateStatusResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for approval');
			mandateStatusResponse = await mandateStatusRetryLogic({
				mandateID: mandateResponse.data?.data?.mandate_id,
				retryNumber: 0,
				retries: 5,
				retryDelay: 1,
				resetState: () => {
					resetTransactionInterval(state);
					initializeGPayState(gpayPaymentState);
				},
				state
			});
		} else {
			mandateStatusResponse = promiseResponse;
		}
		await handleMandateStatusResponse({
			transactionResponse: mandateStatusResponse,
			failureCallback: () => {
				stopLoading();
				displayError({
					heading: 'Autopay Setup Failed',
					errorSubHeading:
						mandateStatusResponse?.data?.data?.response_description ||
						'We were unable to set up your autopay due to a technical issue. Please try again'
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					isIntegeratedFlow: true,
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: 'Autopay Setup Pending',
					errorSubHeading:
						mandateStatusResponse?.data?.data?.response_description ||
						'You have cancelled the eMandate request for Autopay. Please try again or use another authorisation mode'
				});
			}
		});
		stopLoading();

		// transaction status check
		showLoading('Waiting for payment status');
		const transactionResponse = await mandateTransactionRetryLogic({
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
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				displayError({
					type: 'PAYMENT_FAILED',
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: `Payment of ₹${addCommasToAmountString(amount)} Failed`,
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
					code:
						transactionResponse?.data?.data?.response_code ||
						transactionResponse?.data?.error_code ||
						''
				});
			},
			pendingCallback: () => {
				stopLoading();
				displayPendingPopup({
					isIntegeratedFlow: true,
					orderId: orderPostResponse?.data?.data?.orderId,
					sipId: orderPostResponse?.data?.data?.sipId,
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
			}
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
		showLoading('Waiting for order status');
		const orderPatchResponse = await orderPatch();
		handleOrderPatchResponse({
			orderPatchResponse,
			stopLoading,
			displayError
		});
		onSuccess({
			isIntegeratedFlow: true,
			orderId: orderPostResponse.data?.data?.orderId,
			sipId: orderPostResponse.data?.data?.sipId
		});
	} catch (e) {
		stopLoading();
	}
};
