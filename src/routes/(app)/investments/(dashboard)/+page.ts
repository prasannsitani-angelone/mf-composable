import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getInvestmentData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings`;

		const res = await useFetch(url, {}, fetch);

		if (res?.ok) {
			const investmentData = await res.json();
			return {
				...investmentData
			};
		} else {
			return {};
		}
	};

	return {
		api: {
			investment: browser ? getInvestmentData() : await getInvestmentData()
		},
		layoutConfig: {
			layoutClass:
				'w-full lg:grid lg:grid-cols-[66%_34%] lg:gap-5 xl:w-4/5 max-sm:flex max-sm:flex-col-reverse max-sm:overflow-auto'
		}
	};
}) satisfies PageLoad;
