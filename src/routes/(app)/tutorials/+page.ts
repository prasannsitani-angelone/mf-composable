import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		layoutConfig: {
			hideMobileHeader: true,
			layoutType: 'FULL_HEIGHT_WITHOUT_PADDING',
			layoutBodyClass: '!max-w-full'
		}
	};
}) satisfies PageLoad;
