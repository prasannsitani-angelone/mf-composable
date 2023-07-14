import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getMandatesData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/mandates`;

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

	return {
		api: {
			investment: browser ? getMandatesData() : await getMandatesData()
		},
		layoutConfig: {
			title: 'Autopay',
			layoutType: 'DEFAULT',
			layoutClass: 'pt-2 md:pt-2',
			titleClass: '!text-xl',
			headerClass: ' !py-2.5 !px-4 ',
			showBackIcon: true
		}
	};
}) satisfies PageLoad;
