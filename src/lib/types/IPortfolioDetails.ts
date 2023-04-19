export interface Tag {
	label: string;
	months: number;
	timeScale: string;
	returnPeriod: string;
	bmReturnPeriod: string;
	returnPeriodPer: string;
}

export interface ChartDataType {
	value: number;
	timestamp: number;
}

export interface DistributionType {
	isin: string;
	allocatedValue: number;
	allocatedPer: number;
	companyName: string;
	category: string;
	marketCap: string;
	sector: string;
	instrument: string;
	rating: string;
}
export interface DistributionListType {
	isin: string;
	allocatedValue: number;
	allocatedPer: number;
	companyName: string;
	category: string;
	marketCap: string;
	sector: string;
	instrument: string;
	rating: string;
	name: string;
	percentageHold: number;
	amountValue: number;
	colorCode?: string;
}

export interface CompaniesTableObject {
	name: string;
	companyName: string;
	percentageHold: number;
	amountValue: number;
}

export interface TableDataTypes {
	name: string;
	percentageHold: number;
	amountValue: number;
	colorCode?: string;
}

export interface GraphTableChartTypes {
	type: string;
	parentId: string;
	subLabel: string;
	nameColumnHeader: string;
	nameColumnHeaderForFunds: string;
	footerText: string;
	currentValue: number;
	chartsData: Array<TableDataTypes>;
	graphColors: Array<string>;
	filterTypes: Array<string>;
	filteredData: Array<DistributionListType>;
	selectedFilterIndex: number;
	showColor: boolean;
	showCompaniesFooter: boolean;
	viewMoreFooter: boolean;
	showFundsFilterTable: boolean;
}

export interface ChartAndTableEntities {
	type: string;
	parentId: string;
	subLabel: string;
	nameColumnHeader: string;
	nameColumnHeaderForFunds: string;
	footerText: string;
	currentValue: number;
	chartsData: Array<TableDataTypes>;
	filterTypes: string[];
	filteredData: Array<CompaniesTableObject>;
	selectedFilterIndex: number;
}

export interface ChartAndTable {
	EQUITY: ChartAndTableEntities[];
	DEBT: ChartAndTableEntities[];
}
