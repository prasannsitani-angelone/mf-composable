import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const getMandateByMandateId = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/mandates/${params?.autopayId}`;

		const res = await useFetch(url, {}, fetch);

		if (res?.ok) {
			const mandatesData = res?.data;

			return {
				...mandatesData
			};
		} else {
			return {};
		}
	};

	const getSipsLinkedToMandate = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/sips?mandateId=${params?.autopayId}`;

		const res = await useFetch(url, {}, fetch);

		if (res?.ok) {
			const sipsLinked = res?.data;

			return {
				...sipsLinked
			};
		} else {
			return {};
		}
	};

	return {
		api: {
			mandateData: browser ? getMandateByMandateId() : await getMandateByMandateId(),
			sipsLinked: browser ? getSipsLinkedToMandate() : await getSipsLinkedToMandate()
		},
		layoutConfig: {
			title: 'Autopay Details',
			layoutType: 'DEFAULT',
			layoutClass: 'pt-2 md:pt-2',
			titleClass: '!text-xl',
			headerClass: ' !py-2.5 !px-4 ',
			showBackIcon: true
		}
	};
}) satisfies PageLoad;
