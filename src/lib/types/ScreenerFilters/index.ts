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
}

export interface FilterData {
	quickFilters: unknown;
	filters: FilterOption[];
	filtersCount?: number;
	queryPath?: string;
}
