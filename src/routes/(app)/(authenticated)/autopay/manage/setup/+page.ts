import type { PageLoad } from './$types';
import { decodeToObject } from '$lib/utils/helpers/params';

export const load = (({ url }) => {
	const params = url.searchParams.get('params');
	const decodedParams = decodeToObject(params);
	const { acc, name } = decodedParams;
	return {
		pageParam: {
			accountNumber: acc,
			accountName: name
		},
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
