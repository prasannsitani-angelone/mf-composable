export interface MapItem {
	label: string;
	max: number;
	min: number;
}

export interface MapItems {
	items: MapItem[];
	type: string;
}

export interface FilterOption {
	label: string;
	options?: FilterOption[];
	q?: string;
	type?: string;
	selected?: boolean;
	maxSelectedVal?: number;
	minSelectedVal?: number;
	min?: number;
	max?: number;
	count?: number;
	search?: boolean;
	paths?: string[];
	mapItems?: MapItems[];
	mapItemIndex?: number;
	mapType?: string;
}

export interface FilterData {
	quickFilters: unknown;
	filters: FilterOption[];
	filtersCount?: number;
	queryPath?: string;
	partiallySelectedTopLevelNodes?: number;
}
