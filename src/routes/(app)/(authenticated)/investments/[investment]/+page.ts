import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import { getCompleteSIPDateBasedonDD } from '$lib/utils/helpers/date';
import { getEmandateDataFunc } from '$components/Payment/api';
import type { MandateWithBankDetails } from '$lib/types/IEmandate';

export const load = (async ({ fetch, params }) => {
	const fundName = params['investment'];
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();

	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];

	const getSchemeData = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		return useFetch(url, {}, fetch);
	};

	const getHoldingsData = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}`;
		return useFetch(url, {}, fetch);
	};

	const getHoldingsChartData = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}/chart`;
		return useFetch(url, {}, fetch);
	};

	const getOrdersData = () => {
		const reqQuery = `?isin=${isin}&schemeCode=${schemeCode}`;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/transactions${reqQuery}`;
		return useFetch(url, {}, fetch);
	};

	const getPreviousPaymentDetails = async () => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/user/paymentHandlers`;
			return await useFetch(url, {}, fetch);
		} catch (e) {
			return {};
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

	const getPageData = async () => {
		try {
			const res = await Promise.all([
				getHoldingsData(),
				getHoldingsChartData(),
				getOrdersData(),
				getSchemeData(),
				getMandateData()
			]);
			return {
				holdingsData: res[0].ok ? res[0].data || {} : {},
				chartData: res[1].ok && res[1].data?.status === 'success' ? res[1].data?.data || {} : {},
				ordersData:
					res[2].ok && res[2].data?.status === 'success' ? res[2].data?.transactions || [] : [],
				schemeData: res[3].ok ? res[3].data || {} : {},
				mandateData: res[4]
			};
		} catch (e) {
			console.log('the errorrrrrr -- ', e);
		}
	};

	return {
		api: {
			allResponse: browser ? getPageData() : await getPageData(),
			previousPaymentDetails: browser
				? getPreviousPaymentDetails()
				: await getPreviousPaymentDetails()
		},
		layoutConfig: {
			title: 'Investment Details',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		}
	};
}) satisfies PageLoad;
