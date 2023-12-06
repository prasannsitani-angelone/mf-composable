import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import {
	clickOnThreeDots,
	sipCreatedDateImpressionAnalytics,
	sipDetailsScreenOpenAnalytics,
	sipInProgressNudgeImpressionAnalytics
} from '$lib/analytics/sipbook/sipbook';
import type { ISip } from '$lib/types/ISipType';
import { getDateTimeString } from '$lib/utils/helpers/date';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import { sipBookStore } from '$lib/stores/SipBookStore';

export const load = (async ({ fetch, params, depends }) => {
	const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${params?.sipId}`;
	let sipData: ISip;
	const showThreeDotsIcon = true;
	let showDropDown = false;
	const getSipData = async () => {
		const res = await useFetch(sipUrl + '?history=true', {}, fetch);
		if (res.ok && res?.data?.data) {
			const {
				isSipInprocess,
				sipOrderHistory,
				firstOrderToday,
				createdTs,
				schemeName,
				installmentAmount,
				nextSipDueDate,
				bankName,
				accountNo
			} = res.data.data;
			if (isSipInprocess) {
				sipInProgressNudgeImpressionAnalytics({
					value: 'You cannot cancel your SIP as your SIP order is InProgress'
				});
			}
			if (!sipOrderHistory?.length && !firstOrderToday && createdTs) {
				sipCreatedDateImpressionAnalytics();
			}
			const eventMetaData = {
				FundName: schemeName,
				SIPSchedule: {
					InstallmentAmount: installmentAmount,
					NextSIPPayment: getDateTimeString(nextSipDueDate, 'DATE', true)
				},
				BankDetails: {
					BankName: bankName,
					BankAccountNumber: accountNo
				}
			};
			sipDetailsScreenOpenAnalytics(eventMetaData);
			return res.data.data;
		}
		return sipData;
	};
	const onThreeDotsClick = async () => {
		showDropDown = !sipBookStore.showdropdown();
		sipBookStore.updateStore({ showdropdown: showDropDown });
		if (sipBookStore.showdropdown()) {
			clickOnThreeDots();
		}
	};
	depends('skipsip');
	return {
		layoutConfig: {
			title: 'SIP Details',
			showBackIcon: true,
			showThreeDotsIcon,
			onThreeDotsClick,
			layoutType: 'TWO_COLUMN'
		},
		sipId: params?.sipId || '',
		api: {
			getSipData: browser ? getSipData() : await getSipData()
		}
	};
}) satisfies PageLoad;
