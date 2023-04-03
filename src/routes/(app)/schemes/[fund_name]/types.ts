export interface NavDetails {
	navValue: number;
	navDate: string;
}

export interface LineChartData {
	time: string[];
	navValue: number[];
}

export interface FundComparisons {
	otherScheme?: OtherSchemeEntityOrSchemeInfoEntity[] | null;
	sameAmcScheme: SameAmcScheme;
}
export interface OtherSchemeEntityOrSchemeInfoEntity {
	schemeCode: string;
	isin: string;
	schemeName: string;
	categoryName: string;
	subcategoryName: string;
	reInvestmentPlan: string;
	schemePlan: string;
	logoUrl: string;
	returns1yr: number;
	returns3yr: number;
	returns5yr: number;
	arqRating: number;
	purchaseTxnMode: string;
	navValue: number;
	minSipAmount: number;
	previousNavValue: number;
	swpFlag: string;
	stpFlag: string;
	switchFlag: string;
	amcCode: number;
}
export interface SameAmcScheme {
	amcName: string;
	schemeInfo?: OtherSchemeEntityOrSchemeInfoEntity[] | null;
}
