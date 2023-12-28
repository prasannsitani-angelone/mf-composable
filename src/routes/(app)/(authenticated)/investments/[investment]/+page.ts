import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import { getCompleteSIPDateBasedonDD } from '$lib/utils/helpers/date';
import { getEmandateDataFunc } from '$components/Payment/api';
import type { BankDetailsEntity } from '$lib/types/IUserProfile';
import type { MandateWithBankDetails } from '$lib/types/IEmandate';
import { versionStore } from '$lib/stores/VersionStore';

export const load = (async ({ fetch, parent, params }) => {
	const parentData = await parent();
	const profileData = parentData.profile;
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

	const bankAccNumToLogoMap = () => {
		const accNumToLogoMap = {};
		const bankList = profileData.bankDetails;

		(bankList || []).forEach((bank: BankDetailsEntity) => {
			accNumToLogoMap[bank.accNO] = bank.bankLogo;
		});

		return accNumToLogoMap;
	};

	const getAllMandates = (madateMap: { [propKey: string]: MandateWithBankDetails }) => {
		const all = (Object.values(madateMap) || []).flat();
		return all;
	};

	const getMandateData = async () => {
		const mandateResponse = await getEmandateDataFunc({
			amount: 0,
			sipDate: getCompleteSIPDateBasedonDD(4, new Date(), 30)
		});
		const accNumToLogoMap = bankAccNumToLogoMap();
		let mandateData = getAllMandates(mandateResponse?.data);
		mandateData = mandateData.map((mandate) => {
			const updatedMandate = {
				...mandate,
				bankLogo: accNumToLogoMap[mandate.accountNo]
			};
			return updatedMandate;
		});
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
				mandateData: versionStore.getVersion() === 'B' ? res[4] : []
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
