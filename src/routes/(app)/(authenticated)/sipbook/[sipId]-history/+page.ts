import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { sipHistoryScreenOpenAnalytics } from '$lib/analytics/sipbook/sipbook';
import type { ISip } from '$lib/types/ISipType';
import { getDateTimeString } from '$lib/utils/helpers/date';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${params?.sipId}`;
	let sipData: ISip;
	const getSipData = async () => {
		const res = await useFetch(sipUrl + '?history=true', {}, fetch);
		if (res.ok && res?.data?.data) {
			const { sipId, sipOrderHistory } = res.data.data;
			const eventMetaData = {
				SIPId: sipId,
				SIPHistory: sipOrderHistory?.map(
					(item: { orderCompletionTs: number; orderStatus: string; Message: string }) => ({
						OrderCompletionDate: getDateTimeString(item?.orderCompletionTs, 'DATE', true),
						Status: item?.orderStatus?.toUpperCase() === 'VALID' ? 'Success' : 'Failed',
						Message: item?.Message
					})
				)
			};
			sipHistoryScreenOpenAnalytics(eventMetaData);
			return res.data.data;
		}
		return sipData;
	};

	return {
		layoutConfig: {
			title: 'SIP History',
			showBackIcon: true
		},
		api: {
			getSipData: browser ? getSipData() : await getSipData()
		}
	};
}) satisfies PageLoad;
