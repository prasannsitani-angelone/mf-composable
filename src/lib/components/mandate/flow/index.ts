import { base } from '$app/paths';
import { PUBLIC_MANDATE_SOURCE } from '$env/static/public';
import logger from '$lib/utils/logger';
import { callMandateAPI, upiValidateFunc } from '../api';
import {
	handleEmandateResponse,
	handleTransactionResponse,
	handleUPIValidationResponse
} from '../handlers';
import {
	closeNetBankingPaymentWindow,
	getMandateAmount,
	intializeNetBankingState,
	isNetBakingPaymentWindowClosed,
	netBankingWindowCloseLogic,
	initializeUPIState,
	upiWindowCloseLogic,
	resetTransactionInterval,
	transactionRetryLogic,
	initializeGPayState,
	googlePayCloseLogic
} from '../utils';

export const netBankingFlow = async (params) => {
	const {
		amount,
		sipStartDate,
		sipEndDate,
		accNO,
		ifscCode,
		bankName,
		shortName,
		clientId,
		accountType,
		mobile,
		netBankingState = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		onError = () => undefined,
		onSuccess = () => undefined
	} = params || {};
	try {
		// open ent banking window
		netBankingState.paymentWindow = window.open(
			`${window.location.origin}${base}/intermediateLoading`,
			'EMANDATE_WINDOW'
		);

		// show loading
		showLoading('Redirecting to Digio');

		// call mandate api for net banking
		const response = await callMandateAPI({
			client_full_name: shortName,
			client_mobile_number: mobile,
			client_code: clientId,
			bank_name: bankName,
			bank_account_number: accNO,
			bank_account_type: accountType || 'savings',
			bank_ifsc_code: ifscCode,
			type: 'api',
			frequency: 'monthly',
			product: 'mf',
			amount: getMandateAmount('NET_BANKING', amount),
			request_source: PUBLIC_MANDATE_SOURCE,
			start_date: sipStartDate,
			end_date: sipEndDate
		});

		// check until then window is closed or not
		if (isNetBakingPaymentWindowClosed(netBankingState)) {
			intializeNetBankingState(netBankingState);
			stopLoading();
			onError({
				heading: 'Autopay Setup Failed',
				errorSubHeading: 'You have cancelled the request for Autopay. Please try again.'
			});
			throw new Error('');
		}
		// if not then handle the response
		handleEmandateResponse({
			response,
			stopLoading,
			onError,
			resetState: () => intializeNetBankingState(netBankingState)
		});

		// if success then replace the digio url
		netBankingState.paymentWindow.location.replace(
			`${response?.data?.data?.redirect_url}?redirect_url=${window.location.origin}${base}/emandateCallback`
		);

		showLoading('Waiting for approval');

		let closedByUser = true;
		const listenerFunc = (event) => {
			if (location.origin === event?.origin && event?.data?.source === 'emandateCallback') {
				logger.debug({
					type: 'Emandate Redirection Response',
					params: event?.data
				});
				stopLoading();
				closedByUser = false;
				closeNetBankingPaymentWindow(netBankingState);
				if (event.data.status === 'success') {
					const emandateID = event.data.digio_doc_id;
					onSuccess({
						id: emandateID
					});
				} else if (event.data.status === 'failure') {
					stopLoading();
					onError({
						heading: 'Autopay Setup Failed',
						errorSubHeading:
							event.data.message ||
							'We were unable to set up your autopay due to a technical issue. Please try again'
					});
				} else {
					stopLoading();
					onError({
						heading: 'Autopay Setup Failed',
						errorSubHeading:
							event.data.message ||
							'You have cancelled the eMandate request for Autopay. Please try again or use another authorisation mode'
					});
				}
			}
		};
		// start listening from child window for the event
		window.addEventListener('message', listenerFunc);
		// and also start listening if window is closed or not
		await netBankingWindowCloseLogic({
			netBankingState
		});
		intializeNetBankingState(netBankingState);
		// remove listener
		window.removeEventListener('message', listenerFunc, false);

		if (closedByUser) {
			stopLoading();
			onError({
				heading: 'Autopay Setup Failed',
				errorSubHeading:
					'You have cancelled the eMandate request for Autopay. Please try again or use another authorisation mode'
			});
		}
	} catch (e) {
		stopLoading();
	}
};

export const upiFlow = async (params) => {
	const {
		amount,
		sipStartDate,
		sipEndDate,
		accNO,
		ifscCode,
		bankName,
		shortName,
		clientId,
		accountType,
		mobile,
		inputId,
		upiState = {},
		state = {},
		showUPILoading = () => undefined,
		stopUPILoading = () => undefined,
		showLoading = () => undefined,
		stopLoading = () => undefined,
		updateUPITimer = () => undefined,
		onUPIValidationFailure = () => undefined,
		onError = () => undefined,
		onPending = () => undefined,
		onSuccess = () => undefined
	} = params || {};
	try {
		const upiValidationResponse = await upiValidateFunc({
			bankName,
			inputId,
			showLoading: showUPILoading,
			stopLoading: stopUPILoading
		});
		handleUPIValidationResponse({
			upiValidationResponse,
			onUPIValidationFailure
		});

		showLoading('Initiating UPI Mandate');

		const response = await callMandateAPI({
			client_full_name: shortName,
			client_mobile_number: mobile,
			client_code: clientId,
			bank_name: bankName,
			bank_account_number: accNO,
			bank_account_type: accountType || 'savings',
			bank_ifsc_code: ifscCode,
			type: 'upi',
			vpa: inputId,
			frequency: 'monthly',
			product: 'mf',
			amount: getMandateAmount('UPI', amount),
			request_source: PUBLIC_MANDATE_SOURCE,
			start_date: sipStartDate,
			end_date: sipEndDate
		});

		handleEmandateResponse({
			response,
			stopLoading,
			onError,
			resetState: () => initializeUPIState(upiState)
		});

		stopLoading();
		upiState.flow = 2;
		upiState.timer = 10 * 60; // hard coding the validity as emandate api doesn't provide this
		upiState.timerInterval = setInterval(() => {
			if (upiState.timer <= 0) {
				clearInterval(upiState.timerInterval);
			}
			updateUPITimer(upiState.timer - 1);
		}, 1000);
		const promiseResponse = await Promise.any([
			transactionRetryLogic({
				mandateID: response.data?.data?.mandate_id,
				retryNumber: 0,
				retries: Math.ceil(upiState.timer / 3),
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
		let transactionResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for approval');
			transactionResponse = await transactionRetryLogic({
				mandateID: response.data?.data?.mandate_id,
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
			transactionResponse = promiseResponse;
		}
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				onError({
					heading: 'Autopay Setup Failed',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'We were unable to set up your autopay due to a technical issue. Please try again'
				});
			},
			pendingCallback: () => {
				stopLoading();
				onPending({
					heading: 'Autopay Setup Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'You have cancelled the eMandate request for Autopay. Please try again or use another authorisation mode'
				});
			}
		});

		onSuccess({
			id: response.data?.data?.mandate_id
		});
	} catch (e) {
		stopLoading();
	}
};

export const walletFlow = async (params) => {
	const {
		emandateModeName,
		emandateModeAPIName,
		amount,
		sipStartDate,
		sipEndDate,
		accNO,
		ifscCode,
		bankName,
		shortName,
		clientId,
		accountType,
		mobile,
		gpayPaymentState = {},
		state = {},
		showLoading = () => undefined,
		stopLoading = () => undefined,
		onError = () => undefined,
		onPending = () => undefined,
		onSuccess = () => undefined
	} = params || {};
	try {
		showLoading(`Redirecting to ${emandateModeName}`);
		const response = await callMandateAPI({
			client_full_name: shortName,
			client_mobile_number: mobile,
			client_code: clientId,
			bank_name: bankName,
			bank_account_number: accNO,
			bank_account_type: accountType || 'savings',
			bank_ifsc_code: ifscCode,
			type: 'upi',
			intent: true,
			frequency: 'monthly',
			product: 'mf',
			amount: getMandateAmount('UPI', amount),
			request_source: PUBLIC_MANDATE_SOURCE,
			start_date: sipStartDate,
			end_date: sipEndDate
		});

		handleEmandateResponse({
			response,
			stopLoading,
			onError,
			resetState: () => initializeGPayState(gpayPaymentState)
		});

		const redirectUrl = response.data?.data?.[`${emandateModeAPIName}_deep_link`];
		window.open(redirectUrl, '_self');
		showLoading('Waiting for approval');
		const promiseResponse = await Promise.any([
			transactionRetryLogic({
				mandateID: response.data?.data?.mandate_id,
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
				emandateModeName,
				showLoading
			})
		]);
		let transactionResponse = {};
		if (promiseResponse === 'WINDOW_CLOSED') {
			showLoading('Waiting for approval');
			transactionResponse = await transactionRetryLogic({
				mandateID: response.data?.data?.mandate_id,
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
			transactionResponse = promiseResponse;
		}
		await handleTransactionResponse({
			transactionResponse,
			failureCallback: () => {
				stopLoading();
				onError({
					heading: 'Autopay Setup Failed',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'We were unable to set up your autopay due to a technical issue. Please try again'
				});
			},
			pendingCallback: () => {
				stopLoading();
				onPending({
					heading: 'Autopay Setup Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'You have cancelled the eMandate request for Autopay. Please try again or use another authorisation mode'
				});
			}
		});
		onSuccess({
			id: response.data?.data?.mandate_id
		});
	} catch (e) {
		stopLoading();
	}
};
