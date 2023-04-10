import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { profileStore } from '$lib/stores/ProfileStore';
import { tokenStore } from '$lib/stores/TokenStore';
import { MFCommonHeader } from '$lib/utils';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const headers = MFCommonHeader();
	const getSchemeData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard?options=true`;

		const res = await fetch(url, {
			headers
		});
		if (res.ok) {
			const discoverFundData = await res.json();
			return {
				...discoverFundData
			};
		} else {
			return {};
		}
	};

	const getInvestmentData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings`;

		const headers = {
			userType: `${profileStore?.userType()}`,
			accountType: `${profileStore?.accountType()}`,
			authorization: `Bearer ${tokenStore?.activeToken()}`
		};
		const res = await fetch(url, {
			headers
		});

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
			homePage: browser ? getSchemeData() : await getSchemeData(),
			investment: browser ? getInvestmentData() : await getInvestmentData()
		},
		layoutConfig: {
			layoutClass:
				'w-full lg:grid lg:grid-cols-[66%_34%] lg:gap-5 xl:w-4/5 max-sm:flex max-sm:flex-col-reverse max-sm:overflow-auto'
		}
	};
}) satisfies PageLoad;
