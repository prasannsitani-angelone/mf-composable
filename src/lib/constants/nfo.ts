import type { TableColumnToggle } from '$lib/utils';

export const nfoTableToggleList: Array<TableColumnToggle> = [
	{
		label: 'Open Date',
		field: 'nfoStartDate',
		prefix: '',
		suffix: ''
	},
	{
		label: 'Close Date',
		field: 'nfoEndDate',
		prefix: '',
		suffix: ''
	},
	{
		label: 'Current NAV',
		field: 'navValue',
		prefix: '₹',
		suffix: ''
	},
	{
		label: 'Min amount',
		field: 'minPurchaseAmount',
		prefix: '₹',
		suffix: ''
	}
];

export const closedNfoTableToggleList: Array<TableColumnToggle> = [
	{
		label: 'Open Date',
		field: 'nfoStartDate',
		prefix: '',
		suffix: ''
	},
	{
		label: 'Close Date',
		field: 'nfoEndDate',
		prefix: '',
		suffix: ''
	}
];
