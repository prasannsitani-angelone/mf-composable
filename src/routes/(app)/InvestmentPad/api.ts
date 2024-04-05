import { browser } from '$app/environment';
import { getEmandateDataFunc } from '$components/Payment/api';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { MandateWithBankDetails } from '$lib/types/IEmandate';
import { getCompleteSIPDateBasedonDD } from '$lib/utils/helpers/date';
import { useFetch } from '$lib/utils/useFetch';

const getPreviousPaymentDetails = async () => {
	try {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/user/paymentHandlers`;
		return await useFetch(url, {});
	} catch (e) {
		return new Error('Something went wrong');
	}
};

const getAllMandates = (madateMap: { [propKey: string]: MandateWithBankDetails }) => {
	const all = (Object.values(madateMap) || []).flat();
	return all;
};

const getMandateData = async () => {
	const mandateResponse = await getEmandateDataFunc({
		amount: 0,
		sipDate: getCompleteSIPDateBasedonDD(4, new Date(), 30),
		mandateType: 'UPI,YES',
		mandateFor: 'LUMPSUM'
	});
	const mandateData = getAllMandates(mandateResponse?.data);
	return mandateData;
};

export const getDataforInvestment = async () => {
	if (browser) {
		try {
			const res = await Promise.all([getPreviousPaymentDetails(), getMandateData()]);
			return {
				previousPaymentDetails: res[0],
				mandateData: res[1]
			};
		} catch (e) {
			return new Error('Something went wrong');
		}
	}
};
