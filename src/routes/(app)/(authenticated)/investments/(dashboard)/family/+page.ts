import type { PageLoad } from './$types';

export const load = (() => {
	return {
		layoutConfig: {
			title: 'Family Portfolio',
			layoutType: 'DEFAULT',
			layoutClass: 'bg-background-alt md:bg-background',
			titleClass: '!text-xl',
			headerClass: ' !py-2.5 !px-4 ',
			showBackIcon: true
		}
	};
}) satisfies PageLoad;
