import type { PageLoad } from './$types';
import { decodeToObject } from '$lib/utils/helpers/params';
import { PUBLIC_MANDATE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import { browser } from '$app/environment';
import type { BankDetailsEntity } from '$lib/types/IUserProfile';

export const load = (async ({ url, parent, fetch }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params);
	const { acc } = decodedParams;

	const getMandateOptions = async () => {
		const parentData = await parent();
		const profileData = parentData.profile;
		const bankDetails = profileData?.bankDetails?.find((element: BankDetailsEntity) =>
			element.accNO?.endsWith(acc)
		);
		let res = {};
		if (bankDetails) {
			const url = `${PUBLIC_MANDATE_BASE_URL}/mandate/options?product=mf&ifsc=${bankDetails?.ifscCode}`;
			res = await useFetch(url, {}, fetch);
		}
		return res;
	};

	return {
		apis: {
			mandateOptions: browser ? getMandateOptions() : await getMandateOptions()
		},
		pageParam: decodedParams,
		layoutConfig: {
			title: 'Set Up Autopay',
			layoutType: 'DEFAULT',
			layoutClass: 'pt-2 md:pt-2',
			titleClass: '!text-xl',
			headerClass: ' !py-2.5 !px-4 ',
			showBackIcon: true
		}
	};
}) satisfies PageLoad;
