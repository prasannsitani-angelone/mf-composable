import { PUBLIC_MANDATE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';

export const fetchTransactionDataFunc = async (params) => {
	try {
		const { mandateID } = params || {};
		const url = `${PUBLIC_MANDATE_BASE_URL}/mandate/${mandateID}`;
		const response = await useFetch(url);
		return response;
	} catch (e) {
		return {};
	}
};

export const callMandateAPI = async (body) => {
	try {
		const url = `${PUBLIC_MANDATE_BASE_URL}/mandate`;
		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify(body)
		});
		return response;
	} catch (e) {
		return {};
	}
};

export const upiValidateFunc = async (params) => {
	const { bankName, inputId, showLoading, stopLoading } = params;
	try {
		showLoading();
		const url = `${PUBLIC_MANDATE_BASE_URL}/mandate/validate-vpa`;
		const response = await useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				bank_name: bankName?.toLowerCase() || '',
				product: 'mf',
				vpa: inputId
			})
		});
		stopLoading();
		return response;
	} catch (e) {
		stopLoading();
		return {};
	}
};
