import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getNudgeData = async () => {
		let nudgesData;

		const url = `${PUBLIC_MF_CORE_BASE_URL}/nudges`;
		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			nudgesData = res?.data;
			return nudgesData;
		}
		return nudgesData;
	};
	return {
		api: {
			data: browser ? getNudgeData() : await getNudgeData()
		}
	};
}) satisfies PageLoad;
