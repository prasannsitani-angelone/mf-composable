export interface Tags {
	label: '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';
	months: number;
	timeScale: 'month' | 'year';
	returnPeriod: string;
	bmReturnPeriod: string;
	text: string;
}
