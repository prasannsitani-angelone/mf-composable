import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { NudgeDataType } from '$lib/types/INudge';
import { useFetch } from '$lib/utils/useFetch';

const getNudgeData = async (data) => {
	let nudgesData: NudgeDataType = {
		nudges: []
	};

	if (!data.isGuest) {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/nudges`;
		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			nudgesData = res?.data;
			return nudgesData;
		}
		return nudgesData;
	}
	return nudgesData;
};

export { getNudgeData };
