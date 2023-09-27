export interface DiscoverFund {
	categories?: DashboardCategoryEntity[];
	weeklyTopSchemes?: WeeklyTopSchemesEntity[] | null;
	banner?: null;
	amcData?: PromotionsEntity;
}
export interface DashboardCategoryEntity {
	type: string;
	name: string;
	data: CategoryOptionsEntity[];
}

export interface CategoryOptionsEntity extends SearchOptionsEntity {
	shortDescription: string;
	detailedDescription: string[];
	data: CategorySubOptionsEntity[];
}

export interface CategorySubOptionsEntity {
	schemeCode: string;
	isin: string;
	schemeName: string;
	schemePlan: string;
	logoUrl: string;
	returns3yr: number;
	sortBy2: number;
	noOfClientInvested: number;
	schemeCategory: string;
	categoryOptionName: string;
	textMessage: string;
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
	schemeInfo?: PromotionScheme;
}
interface PromotionScheme {
	schemeCode: string;
	isin: string;
	schemeName: string;
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
	amcCode: string;
	isFavourite: boolean;
	isCartItem: boolean;
	isLumpsumAllowed: string;
	isSipAllowed: string;
	minPurchaseAmount: number;
	noOfClientInvested: number;
}
