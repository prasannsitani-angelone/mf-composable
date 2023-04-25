import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { inactiveSipsScreenOpenAnalytics } from '$lib/analytics/sipbook/sipbook';
import type { IInactiveSip } from '$lib/types/ISipType';
import { getDateTimeString } from '$lib/utils/helpers/date';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getInactiveSipData = async () => {
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips`;
		const res = await useFetch(sipUrl + '?InvestmentType=SIP&status=SIP_CANCELLED', {}, fetch);
		if (res.ok) {
			const sipData = res.data;
			const eventMetaData: {
				inactiveSipsList: {
					sipId: number;
					schemeName: string;
					installmentAmount: number;
					cancellationDate: string;
				}[];
			} = {
				inactiveSipsList: []
			};
			sipData?.data?.cancelledSips?.forEach((sip: IInactiveSip) => {
				const metaDataObject = {
					sipId: sip?.sipId,
					schemeName: sip?.schemeName,
					installmentAmount: sip?.installmentAmount,
					cancellationDate: getDateTimeString(sip?.cancelledTs, 'DATE', true)
				};
				eventMetaData.inactiveSipsList.push(metaDataObject);
			});
			inactiveSipsScreenOpenAnalytics(eventMetaData);
			return sipData?.data?.cancelledSips || [];
		}
		return [];
	};

	return {
		layoutConfig: {
			title: 'Inactive SIPs',
			showBackIcon: true
		},
		api: {
			getInactiveSipData: browser ? getInactiveSipData() : await getInactiveSipData()
		}
	};
}) satisfies PageLoad;
