import type { PageLoad } from './$types';

export const load = (() => {
	return {
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
