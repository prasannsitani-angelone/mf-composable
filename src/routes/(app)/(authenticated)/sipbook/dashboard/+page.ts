import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL_V2 } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import type { ISipBookData } from '$lib/types/ISipType';
import { encodeObject } from '$lib/utils/helpers/params';
import { faqsIconClick } from '$lib/analytics/faqs/faqs';
import { getEmandateDataFunc } from '$components/Payment/api';
import type { MandateWithBankDetails } from '$lib/types/IEmandate';
import { getInvestmentData, getSipRecommendationData } from '$lib/api/secondSip';

export const load = (async ({ fetch, depends }) => {
	let sipBookData: ISipBookData | null = null;

	const getSipBookData = async () => {
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL_V2}/sips`;
		const res = await useFetch(sipUrl + '?InvestmentType=SIP', {}, fetch);
		if (res.ok) {
			sipBookData = res?.data?.data || [];
			return sipBookData;
		} else if (res?.status < 500) {
			return [];
		} else {
			return new Error('Something Went Wrong');
		}
	};
	depends('app:sipbook');

	const faqParams = encodeObject({
		tag: 'sips',
		showRecentOrders: true
	});

	const onClickFaqsIcon = () => {
		faqsIconClick({
			Source: 'SIPBook'
		});
	};

	const getMandateData = async (params) => {
		const { amount, sipDate } = params || {};
		let mandateList: MandateWithBankDetails[] = [];
		const emandateResponse = await getEmandateDataFunc({ amount, sipDate });
		const getAllMandates = (madateMap: { [propKey: string]: MandateWithBankDetails }) => {
			const all = (Object.values(madateMap) || []).flat();
			return all;
		};
		mandateList = getAllMandates(emandateResponse?.data);
		return mandateList;
	};

	return {
		layoutConfig: {
			title: 'SIPs',
			titleClass: '!text-xl',
			headerClass: '!bg-background !py-2.5 !px-4 shadow-none',
			showBottomNavigation: true,
			showFaqIcon: true,
			faqParams,
			onClickFaqsIcon
		},
		sipBookData: sipBookData,
		api: {
			getSipBookData: browser ? getSipBookData() : await getSipBookData(),
			getMandates: async (params) =>
				browser ? getMandateData(params) : await getMandateData(params),
			investmentData: browser ? getInvestmentData() : await getInvestmentData(),
			recommendedSipsData: browser ? getSipRecommendationData() : await getSipRecommendationData()
		}
	};
}) satisfies PageLoad;
