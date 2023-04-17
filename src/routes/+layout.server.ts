import type { LayoutServerLoad } from './(app)/$types';

export const load = (async ({ locals }) => {
	// Device type will be available in PageData across the app
	const { scheme, host, deviceType } = locals;

	return {
		scheme,
		host,
		deviceType
	};
}) satisfies LayoutServerLoad;
