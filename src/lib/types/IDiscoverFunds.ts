export interface DiscoverFund {
	searchOptions?: SearchOptionsEntity[];
	weeklyTopSchemes?: WeeklyTopSchemesEntity[] | null;
	banner?: null;
}
export interface SearchOptionsEntity {
	id: string;
	name: string;
	iconUrl: string;
}
export interface PromotionsEntity {
	header: string;
	id: string;
	name: string;
	uri: string;
}
export interface WeeklyTopSchemesEntity {
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
	isFavourite: true;
	isCartItem: false;
	isLumpsumAllowed: string;
	isSipAllowed: string;
	minPurchaseAmount: number;
	noOfClientInvested: number;
}
