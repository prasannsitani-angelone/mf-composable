import type { FilterOption } from '$lib/types/ScreenerFilters';

export const removeNullOrUndefined = (arr = []) => {
	return arr
		.map((item) => {
			if (Array.isArray(item)) {
				const nestedResult = removeNullOrUndefined(item);
				return nestedResult.length > 0 ? nestedResult : null;
			}
			return item !== undefined && item !== null ? item : null;
		})
		.filter((item) => item !== null);
};

export const getSelectedFilterData = (filters: FilterOption[]) => {
	const modifiedData = (filters || [])?.map((filter) => {
		if (!filter?.type?.length && filter?.selected) {
			const filterObj = {};
			if (filter?.paths?.length) {
				filterObj.label = filter?.paths[filter?.paths?.length - 1];
			}
			return filterObj;
		} else if (filter?.type === 'multi') {
			const filterObj = {};
			if (filter?.paths?.length) {
				filterObj[`${filter?.label || 'label'}`] = getSelectedFilterData(filter?.options);
			}
			return filterObj;
		} else if (filter?.type === 'range') {
			const filterObj = {};
			if (filter?.options?.length) {
				filterObj[`${filter?.label}`] = {
					min: filter?.options[0]?.minSelectedVal,
					max: filter?.options[0]?.maxSelectedVal
				};
			}
			return filterObj;
		}
	});

	return removeNullOrUndefined(modifiedData) || [];
};
