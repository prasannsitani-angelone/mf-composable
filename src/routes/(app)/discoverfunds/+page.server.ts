import { MF_CORE_BASE_URL } from '$env/static/private';
import type { NudgeDataType } from '$lib/types/INudge';
import { useFetch } from '$lib/utils/useFetch';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, locals }) => {
	let nudgesData: NudgeDataType;

	const getNudgeData = async () => {
		if (!locals.isGuest) {
			const url = `${MF_CORE_BASE_URL}/nudges`;
			const res = await useFetch(url, {}, fetch);
			if (res.ok) {
				nudgesData = res?.data;
				return nudgesData;
			}
			return nudgesData;
		}
		return nudgesData;
	};

	return {
		streamed: {
			getNudgeData: await getNudgeData()
		}
	};
}) satisfies PageServerLoad;
