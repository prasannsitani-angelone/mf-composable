import { getFiltersData } from '$lib/api/filters';
import { writable } from 'svelte/store';

const initalStore = {
	data: {
		quickFilters: [],
		filters: [],
		filtersCount: 0,
		partiallySelectedTopLevelNodes: 0,
		queryPath: ''
	},
	error: {},
	isLoading: false,
	initialise: false
};

const initialFilter = [
	{
		label: 'Fund Type',
		values: [
			{
				label: 'Growth'
			}
		]
	}
];

// restructuring data
function restructureFiltersData(data, previousPath = [], type = '') {
	let totalCount = 0;
	data.forEach((item) => {
		if (type === 'range') {
			item.minSelectedVal = item.min;
			item.maxSelectedVal = item.max;
			resetMapFiltersUnderRangeSelector(item);
		}
		item.selected = false;
		item.paths = [...previousPath, item.label];
		if (item.options) {
			item.count = 0;
			const count = restructureFiltersData(item.options, item.paths, item.type);
			item.totalNodes = count;
			totalCount += count;
		} else {
			totalCount += 1;
		}
	});
	return totalCount;
}

function restructureQuickFiltersData(data) {
	data.forEach((item) => {
		item.selected = false;
	});
}

function restructureData(data) {
	if (data?.filters) {
		restructureFiltersData(data.filters);
	}
	if (data?.quickFilters) {
		restructureQuickFiltersData(data.quickFilters);
	}
	data.filtersCount = 0;
	data.queryPath = '';
	data.partiallySelectedTopLevelNodes = 0;
}

// filters updation
function updateAllFiltersUnderThisFilter(filters, value: boolean) {
	let totalCount = 0;
	filters.forEach((filter) => {
		if (filter.options) {
			const count = updateAllFiltersUnderThisFilter(filter.options, value);
			totalCount += count;
			filter.selected = value;
			filter.count = count;
		} else if (filter.selected !== value) {
			filter.selected = value;
			totalCount += value ? 1 : -1;
		}
	});
	return totalCount;
}

function multiFilterUpdateLogic(paths, filters, index: number, value: boolean) {
	for (let i = 0; i < filters.length; i++) {
		const filter = filters[i];
		if (filter.label === paths[index]) {
			if (index + 1 < paths.length) {
				const count = multiFilterUpdateLogic(paths, filter.options, index + 1, value);
				filter.count += count;
				filter.selected = filter.totalNodes === filter.count ? true : false;
				return count;
			} else if (filter.options) {
				const count = updateAllFiltersUnderThisFilter(filter.options, value);
				filter.selected = value;
				filter.count += count;
				return count;
			} else if (filter.selected !== value) {
				filter.selected = value;
				return value ? 1 : -1;
			} else {
				return 0;
			}
		}
	}
}

function resetMapFiltersUnderRangeSelector(filter) {
	const mapItemsArr = filter?.mapItems;
	mapItemsArr?.forEach((mapItems) => {
		mapItems?.items?.forEach((item) => {
			item.selected = false;
		});
	});
}

function selectMapFiltersUnderRangeSelector(filter, mapItemIndex: number, mapType: string) {
	if (mapItemIndex >= 0 && mapType) {
		for (let i = 0; i < filter?.mapItems?.length; i++) {
			const mapItems = filter?.mapItems?.[i];
			if (mapItems.type === mapType) {
				mapItems.items[mapItemIndex].selected = true;
			}
		}
	}
}

function rangeFilterUpdateLogic(
	paths,
	filters,
	index: number,
	min: number,
	max: number,
	mapItemIndex?: number,
	mapType?: string
) {
	for (let i = 0; i < filters.length; i++) {
		const filter = filters[i];
		if (filter.label === paths[index]) {
			if (index + 1 < paths.length) {
				const count = rangeFilterUpdateLogic(
					paths,
					filter.options,
					index + 1,
					min,
					max,
					mapItemIndex,
					mapType
				);
				filter.count += count;
				filter.selected = filter.totalNodes === filter.count ? true : false;
				return count;
			} else {
				resetMapFiltersUnderRangeSelector(filter);
				selectMapFiltersUnderRangeSelector(filter, mapItemIndex, mapType);
				filter.minSelectedVal = min;
				filter.maxSelectedVal = max;
				if (!filter.selected && (filter.max !== max || filter.min !== min)) {
					filter.selected = true;
					filter.count = 1;
					return 1;
				} else if (filter.selected && filter.max === max && filter.min === min) {
					filter.selected = false;
					filter.count = 0;
					return -1;
				} else {
					return 0;
				}
			}
		}
	}
}

function generateQuery(filters, category: string, type: string) {
	let completeQuery = '';
	let putEndCommaString = false;
	filters.forEach((filter) => {
		if (filter.options) {
			const query = generateQuery(filter.options, filter.q, filter.type);
			if (completeQuery && query) {
				completeQuery = `${completeQuery}&${query}`;
			} else if (query) {
				completeQuery = query;
			}
		} else if (type === 'multi' && filter.selected) {
			putEndCommaString = true;
			if (!completeQuery) {
				completeQuery = `${category}=${filter.id}`;
			} else {
				completeQuery = `${completeQuery},${filter.id}`;
			}
		} else if (
			type === 'range' &&
			(filter.minSelectedVal !== filter.min || filter.maxSelectedVal !== filter.max)
		) {
			putEndCommaString = true;
			if (!completeQuery) {
				completeQuery = `${category}=${filter.minSelectedVal}_${filter.maxSelectedVal}`;
			} else {
				completeQuery = `${completeQuery},${filter.minSelectedVal}_${filter.maxSelectedVal}`;
			}
		}
	});
	return putEndCommaString ? `${completeQuery}` : completeQuery;
}

function getCategoryMap(value: string) {
	try {
		const valArray = value.split(',');
		const resultMap = [];
		valArray.forEach((item) => [resultMap.push(item.trim())]);
		return resultMap;
	} catch (e) {
		return [];
	}
}

function getQueryMap(query: string) {
	if (!query) {
		return [];
	}
	try {
		const queryArr = decodeURIComponent(query).replace('?', '').split('&');
		const resultMap = [];
		queryArr.forEach((item: string) => {
			const itemArr = item.split('=');
			const key = itemArr[0];
			let value = itemArr[1];
			value = value.replaceAll('"', '');
			resultMap.push({
				key: key.trim(),
				value
			});
		});
		return resultMap;
	} catch (e) {
		return [];
	}
}

function updateFilterFromCategory(item, filters): number {
	for (let i = 0; i < filters.length; i++) {
		const filter = filters[i];
		if (item.key === filter.q && filter.options) {
			const type = filter.type;
			let totalCountAtSelectedCategory = 0;
			for (let j = 0; j < filter.options.length; j++) {
				const option = filter.options[j];
				const categories = getCategoryMap(item.value);
				for (let k = 0; k < categories.length; k++) {
					const category = categories[k];
					if (category === option.id && type === 'multi') {
						if (option.options) {
							const count = updateAllFiltersUnderThisFilter(option.options, true);
							option.count += count;
							option.selected = true;
							totalCountAtSelectedCategory += count;
						} else if (!option.selected) {
							option.selected = true;
							totalCountAtSelectedCategory += 1;
						}
					} else if (type === 'range') {
						const [min, max] = category.split('_');
						option.minSelectedVal = min;
						option.maxSelectedVal = max;
						totalCountAtSelectedCategory += 1;
					}
				}
			}
			filter.count += totalCountAtSelectedCategory;
			filter.selected = filter.count === filter.totalNodes ? true : false;
			if (totalCountAtSelectedCategory) {
				return totalCountAtSelectedCategory;
			}
		} else if (filter.options) {
			const count = updateFilterFromCategory(item, filter.options);
			if (count > 0) {
				filter.count += count;
				filter.selected = filter.count === filter.totalNodes ? true : false;
				return count;
			}
		}
	}
	return 0;
}

function updateFiltersFromQuery(query: string, data) {
	if (!query) {
		return;
	}
	const queryMap = getQueryMap(query);
	let totalCount = 0;
	queryMap.forEach((item) => {
		totalCount += updateFilterFromCategory(item, data.filters);
	});
	data.filtersCount = totalCount;
}

function getCountOfTopLevelNodesPartiallySelected(filters): number {
	let count = 0;
	filters.forEach((filter) => {
		count += filter.count > 0 ? 1 : 0;
	});
	return count;
}

// quickFilter
function updateQuickFilters(items, filters, type = '') {
	let totalCount = 0;
	filters.forEach((filter) => {
		items.forEach((item) => {
			if (filter.label === item.label) {
				if (item.values) {
					const count = updateQuickFilters(item.values, filter.options, filter.type);
					if (filter.type === 'multi') {
						filter.count += count;
						filter.selected = filter.totalNodes === filter.count ? true : false;
					}
					totalCount += filter.count;
				} else if (type === 'range') {
					filter.minSelectedVal = item.min;
					filter.maxSelectedVal = item.max;
				} else {
					filter.selected = true;
					totalCount += 1;
				}
			}
		});
	});
	return totalCount;
}

function CreateStore() {
	const { subscribe, update } = writable(initalStore);
	let state = initalStore;
	subscribe((v) => {
		state = {
			...v
		};
	});
	const updateStore = (newStore) => {
		return update((prevStore) => {
			return { ...prevStore, ...newStore };
		});
	};
	return {
		subscribe,
		populateFiltersData: function (data, queryPath: string) {
			restructureData(data);
			// need to apply query to filters
			if (queryPath) {
				updateFiltersFromQuery(queryPath, data);
				data.queryPath = generateQuery(data.filters, '', '');
				data.partiallySelectedTopLevelNodes = getCountOfTopLevelNodesPartiallySelected(
					data.filters
				);
			} else {
				// initial filters in case query params didn't come
				data.filtersCount = updateQuickFilters(initialFilter, data.filters);
				data.queryPath = generateQuery(data.filters, '', '');
				data.partiallySelectedTopLevelNodes = getCountOfTopLevelNodesPartiallySelected(
					data.filters
				);
			}
			updateStore({
				isLoading: false,
				initialise: true,
				data
			});
		},
		getFiltersResponse: async function (queryPath = '') {
			// if data present then don't fetch it
			if (state.initialise) {
				// if it comes with queryPath then need to apply query string to filters
				if (queryPath) {
					this.populateFiltersData(state.data, queryPath);
				}
				return;
			}
			// in case data not present
			updateStore({
				isLoading: true
			});
			const response = await getFiltersData();
			if (response.ok) {
				this.populateFiltersData(response?.data?.data, queryPath);
			} else {
				updateStore({
					isLoading: false,
					error: response?.data
				});
			}
		},
		getQuickFilters: function () {
			return JSON.parse(JSON.stringify(state.data?.quickFilters)) || [];
		},
		getFilters: function () {
			return JSON.parse(JSON.stringify(state.data?.filters)) || [];
		},
		getFiltersCount: function () {
			return state.data?.filtersCount;
		},
		getPartiallySelectedTopLevelNodes: function () {
			return state.data?.partiallySelectedTopLevelNodes;
		},
		getData: function () {
			return JSON.parse(JSON.stringify(state.data));
		},
		getQueryPath: function () {
			return state.data?.queryPath;
		},
		// using as utils for page local state
		updatetMultiFilter: function (data, item, value: boolean) {
			const newData = JSON.parse(JSON.stringify(data));
			restructureQuickFiltersData(newData.quickFilters);
			const count = multiFilterUpdateLogic(item.paths, newData.filters, 0, value);
			newData.filtersCount += count;
			newData.partiallySelectedTopLevelNodes = getCountOfTopLevelNodesPartiallySelected(
				newData.filters
			);
			return newData;
		},
		// using as utils for page local state
		updateRangeFilter: function (
			data,
			item,
			min: number,
			max: number,
			mapItemIndex?: number,
			mapType?: string
		) {
			const newData = JSON.parse(JSON.stringify(data));
			restructureQuickFiltersData(newData.quickFilters);
			const count = rangeFilterUpdateLogic(
				item.paths,
				newData.filters,
				0,
				min,
				max,
				mapItemIndex,
				mapType
			);
			newData.filtersCount += count;
			newData.partiallySelectedTopLevelNodes = getCountOfTopLevelNodesPartiallySelected(
				newData.filters
			);
			return newData;
		},
		// using this as completly replacing store's data
		applyFilters: function (data) {
			const newData = JSON.parse(JSON.stringify(data));
			newData.queryPath = generateQuery(newData.filters, '', '');
			updateStore({
				data: newData
			});
		},
		selectQuickFilter: function (name: string) {
			restructureData(state.data);
			let selectedQuickFilterValues = [];
			state.data.quickFilters.forEach((item) => {
				if (item.label === name) {
					item.selected = true;
					selectedQuickFilterValues = item.values;
				}
			});
			state.data.filtersCount = updateQuickFilters(selectedQuickFilterValues, state.data.filters);
			state.data.queryPath = generateQuery(state.data.filters, '', '');
			state.data.partiallySelectedTopLevelNodes = getCountOfTopLevelNodesPartiallySelected(
				state.data.filters
			);
			updateStore({
				data: state.data
			});
		},
		resetStore: function () {
			restructureData(state.data);
			updateStore({
				data: state.data
			});
		},
		reinitializeStore: function () {
			restructureData(state.data);
			state.data.filtersCount = updateQuickFilters(initialFilter, state.data.filters);
			state.data.queryPath = generateQuery(state.data.filters, '', '');
			state.data.partiallySelectedTopLevelNodes = getCountOfTopLevelNodesPartiallySelected(
				state.data.filters
			);
			updateStore({
				data: state.data
			});
		}
	};
}

export const schemeScreenerStore = CreateStore();
