import { base } from '$app/paths';
import { PUBLIC_PAYMENT_BASE_URL, PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import getEmandateData from '$lib/api/emandate';
import { stringToFloat } from '$lib/utils/helpers/numbers';
import { useFetch } from '$lib/utils/useFetch';
import { getFormattedSIPDate } from './util';

export const getUserPaymentMethodsStatus = async (params) => {
	try {
		const { source } = params || {};
		const url = `${PUBLIC_PAYMENT_BASE_URL}/payment-page-data?product=${source}`;
		const response = await useFetch(url, {
			headers: {
				// 'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});

		return response;
	} catch (e) {
		return {};
	}
};

export const orderDeletePatchFunc = async (params) => {
	try {
		const { orderId, pgTxnId } = params || {};
		if (orderId) {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/orders/${orderId}`;
			await useFetch(url, {
				method: 'PATCH',
				body: JSON.stringify({
					paymentReferenceNumber: pgTxnId,
					paymentRemarks: 'Payment cancel',
					paymentStatus: 'cancel',
					pgTxnId,
					purchaseType: 'SIP'
				})
			});
		}
	} catch (e) {
		return;
	}
};

export const sipOrderPatchFunc = async (params) => {
	try {
		const {
			reference_number,
			response_description,
			status,
			transaction_id,
			sipId,
			xRequestId,
			source
		} = params || {};
		const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/${sipId}`;
		const response = await useFetch(url, {
			method: 'PATCH',
			body: JSON.stringify({
				paymentReferenceNumber: reference_number,
				paymentRemarks: response_description,
				paymentStatus: status,
				pgTxnId: transaction_id,
				orderPgRefId: xRequestId
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const lumpsumOrderPatchFunc = async (params) => {
	try {
		const {
			reference_number,
			response_description,
			status,
			transaction_id,
			orderId,
			xRequestId,
			source
		} = params || {};
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders/${orderId}`;
		const response = await useFetch(url, {
			method: 'PATCH',
			body: JSON.stringify({
				paymentReferenceNumber: reference_number,
				paymentRemarks: response_description,
				paymentStatus: status,
				pgTxnId: transaction_id,
				purchaseType: 'LUMPSUM',
				orderPgRefId: xRequestId
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const fetchTransactionDataFunc = async (params) => {
	try {
		const { xRequestId, source, transactionID } = params || {};
		const url = `${PUBLIC_PAYMENT_BASE_URL}/transaction?transaction_id=${transactionID}`;
		const response = await useFetch(url, {
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const fetchMandateTransactionDataFunc = async (params) => {
	try {
		const { xRequestId, source } = params || {};
		const url = `${PUBLIC_PAYMENT_BASE_URL}/transaction?upstream_reference_number=${xRequestId}`;
		const response = await useFetch(url, {
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const initiateNetBankingPaymentFunc = async (params) => {
	const url = `${PUBLIC_PAYMENT_BASE_URL}/net-banking-initiate-payment`;
	try {
		const { amount, accNO, ifscCode, bankName, fullName, xRequestId, source } = params || {};
		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				amount: stringToFloat(amount),
				bank_account_number: accNO,
				bank_ifsc_code: ifscCode,
				bank_name: bankName,
				client_name: fullName,
				product: 'mf',
				request_source: 'mf-web',
				redirect_url: `${window.location.origin}${base}/paymentCallback`,
				upstream_reference_number: xRequestId
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const lumpsumOrderPostFunction = async (params) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;
	try {
		const {
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
			transactionRefNumber,
			sipId,
			sipDueDate,
			xRequestId,
			source,
			sipInstalmentId,
			isAdditional
		} = params || {};
		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				amount: stringToFloat(amount),
				bankAccountNo: accNO,
				bankName: bankName,
				dpNumber: dpNumber,
				emailId: email,
				mobileNo: mobile,
				poaStatus: poaStatus,
				schemeCode: schemeCode,
				subBrokerCode: subBroker,
				transactionType: redirectedFrom === 'SIP_PAYMENTS' ? 'SIP_INSTALLMENT' : 'PURCHASE',
				transactionRefNumber,
				sipId,
				sipDueDate,
				sipInstalmentId,
				isAdditional,
				orderPgRefId: xRequestId
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const sipOrderPostFunction = async (params) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/sips`;
	try {
		const {
			amount,
			dpNumber,
			schemeCode,
			sipType = 'SIP',
			emandateId,
			transactionRefNumber,
			sipFrequency,
			sipMaxInstallmentNo,
			firstSipPayment,
			sipDate,
			xRequestId,
			source,
			isFirstSip,
			integratedFlow,
			isFtpWithMandate,
			bankName,
			bankAccountNo,
			emailId,
			mobileNo
		} = params || {};

		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				emandateId,
				installmentAmount: stringToFloat(amount),
				dpNumber: dpNumber,
				schemeCode: schemeCode,
				type: sipType,
				startDate: getFormattedSIPDate(sipDate),
				frequency: sipFrequency,
				noOfInstallment: sipMaxInstallmentNo,
				firstOrderToday: firstSipPayment,
				folioNumber: '',
				transactionRefNumber,
				veryFirstSip: isFirstSip ? true : false,
				integratedFlow: integratedFlow || false,
				orderPgRefId: xRequestId,
				isFtpWithMandate: isFtpWithMandate,
				bankName: bankName,
				bankAccountNo: bankAccountNo,
				emailId,
				mobileNo
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const getEmandateDataFunc = (params) => {
	const { amount, sipDate, source, mandateType, mandateFor } = params || {};
	return getEmandateData(sipDate, stringToFloat(amount), source, mandateType, mandateFor);
};

export const upiValidateFunc = async (params) => {
	const { bankName, id, xRequestId, source, showLoading, stopLoading } = params || {};
	try {
		if (!id) {
			return {
				ok: true,
				data: {
					data: {
						valid: false
					}
				}
			};
		}
		showLoading();
		const url = `${PUBLIC_PAYMENT_BASE_URL}/upi-validate-vpa`;
		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				bank_name: bankName?.toLowerCase() || '',
				product: 'mf',
				vpa: id
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		stopLoading();
		return response;
	} catch (e) {
		stopLoading();
		return {};
	}
};

export const initiateUPIPayment = async (params) => {
	try {
		const url = `${PUBLIC_PAYMENT_BASE_URL}/upi-initiate-payment`;
		const {
			amount,
			accNO,
			bankName,
			ifscCode,
			fullName,
			upiId,
			redirectedFrom,
			sipRegistrationNumber,
			xRequestId,
			source
		} = params || {};
		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				amount: stringToFloat(amount),
				bank_account_number: accNO,
				bank_ifsc_code: ifscCode,
				bank_name: bankName,
				client_name: fullName,
				vpa: upiId,
				product: 'mf',
				request_source: 'mf-web',
				request_type: 'COLLECT',
				mf_order_reference_number: sipRegistrationNumber,
				mf_order_type: redirectedFrom === 'SIP_PAYMENTS' ? 'sip' : undefined,
				upstream_reference_number: xRequestId
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const triggerWalletStatus = async (params) => {
	try {
		const url = `${PUBLIC_PAYMENT_BASE_URL}/upi-update-transaction-status`;
		const { transactionRefNumber, xRequestId, source } = params || {};
		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				transaction_id: transactionRefNumber
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const initiateWalletPayment = async (params) => {
	try {
		const url = `${PUBLIC_PAYMENT_BASE_URL}/upi-initiate-payment`;
		const {
			amount,
			accNO,
			bankName,
			ifscCode,
			fullName,
			redirectedFrom,
			sipRegistrationNumber,
			xRequestId,
			source,
			apiName
		} = params || {};
		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				amount: stringToFloat(amount),
				bank_account_number: accNO,
				bank_ifsc_code: ifscCode,
				bank_name: bankName,
				client_name: fullName,
				product: 'mf',
				request_source: 'mf-web',
				request_type: 'INTENT',
				app_name: apiName?.toLowerCase(),
				mf_order_reference_number: sipRegistrationNumber,
				mf_order_type: redirectedFrom === 'SIP_PAYMENTS' ? 'sip' : undefined,
				upstream_reference_number: xRequestId
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const cartPostFunction = async (params) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items/orders`;
	try {
		const {
			accNO,
			bankName,
			cartItemIds,
			paymentMode,
			transactionRefNumber,
			xRequestId,
			source,
			emailId,
			mobileNo
		} = params || {};
		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				bankAccount: accNO,
				bankName,
				cartItemIds,
				paymentMode,
				pgTxnId: transactionRefNumber,
				paymentStatus: 'pending',
				orderPgRefId: xRequestId,
				emailId,
				mobileNo
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const cartPatchFunction = async (params) => {
	try {
		const {
			orderId,
			accNO,
			bankName,
			status,
			transaction_id,
			reference_number,
			xRequestId,
			source
		} = params || {};
		const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items/orders/${orderId}`;
		const response = await useFetch(url, {
			method: 'PATCH',
			body: JSON.stringify({
				accNO,
				bankName,
				paymentStatus: status,
				paymentRefNumber: reference_number,
				pgTxnId: transaction_id,
				orderPgRefId: xRequestId
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const sipBulkPostFunction = async (params) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/bulk`;
	try {
		const {
			dpNumber,
			emandateId,
			orders,
			packId,
			transactionRefNumber,
			xRequestId,
			source,
			emailId,
			mobileNo
		} = params || {};

		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				dpNumber,
				emandateId,
				orders,
				packId,
				transactionRefNumber,
				type: 'SIP',
				orderPgRefId: xRequestId,
				emailId,
				mobileNo
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const sipBulkPatchFunc = async (params) => {
	try {
		const {
			reference_number,
			response_description,
			status,
			transaction_id,
			bulkRequestId,
			xRequestId,
			source
		} = params || {};
		const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/bulk/${bulkRequestId}`;
		const response = await useFetch(url, {
			method: 'PATCH',
			body: JSON.stringify({
				paymentReferenceNumber: reference_number,
				paymentRemarks: response_description,
				paymentStatus: status,
				pgTxnId: transaction_id,
				orderPgRefId: xRequestId
			}),
			headers: {
				'X-Request-Id': xRequestId,
				'X-Source': source || 'diy'
			}
		});
		return response;
	} catch (e) {
		return {};
	}
};
