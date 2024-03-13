import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { FetchType } from '$lib/types/Fetch';
import { Cohortplacement } from '$lib/types/ICohort';
import { cohorts, cohorts_LF } from '$lib/constants/cohorts';

export const getCohortMappingforUser = async (
	userCohort: string,
	token: string,
	fetch?: FetchType
) => {
	const lf: Array<Cohortplacement> = [];
	let cohortData = {
		LF: lf,
		SF: lf
	};
	const allMapping = {
		LF: {},
		SF: {}
	};
	const cohortUrl = `${PUBLIC_MF_CORE_BASE_URL}/cohorts/configs?cohort=${userCohort}`;
	const res = await useFetch(
		cohortUrl,
		{
			headers: {
				authorization: `Bearer ${token}`
			}
		},
		fetch
	);
	if (res.ok) {
		cohortData = res?.data?.data || {};
		let map: Record<string, object> = {};
		if (cohortData) {
			cohortData?.LF?.forEach((x) => {
				map[x?.componentName] = {
					rowStart: x.rowStart,
					columnStart: x.columnStart
				};
			});
			allMapping.LF = map;
			map = {};
			cohortData?.SF?.forEach((x) => {
				map[x?.componentName] = {
					rowStart: x.rowStart,
					columnStart: x.columnStart
				};
			});
			allMapping.SF = map;
		}
		return allMapping;
	} else if (res?.status < 500) {
		allMapping.LF = cohorts_LF.Fallback.placementMapping;
		allMapping.SF = cohorts.Fallback.placementMapping;
		return allMapping;
	} else {
		return new Error('Something Went Wrong');
	}
};
