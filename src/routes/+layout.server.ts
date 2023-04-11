import type { LayoutServerLoad } from './(app)/$types';

export const load = (async ({ locals }) => {
	const { scheme, host } = locals;

	return {
		scheme,
		host
	};
}) satisfies LayoutServerLoad;
