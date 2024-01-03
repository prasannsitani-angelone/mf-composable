export interface FundManagerInfoEntity {
	name: string;
	startDate: Date;
}
export interface TaxImplication {
	header: string;
	value: string;
}
export interface SchemeDetails {
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
	totalInvesetment: number;
	navDate: Date;
	navValue: number;
	returns1Month: number;
	returns3Month: number;
	returns6Month: number;
	inceptionReturn: number;
	minSipAmount: number;
	minLumpsumAmount: number;
	launchDate: string;
	sipLockinPeriodFlag: string;
	sipLockinPeriod: number;
	previousNavValue: number;
	previousNavDate: string;
	amcCode: string;
	amcName: string;
	benchmarkIndex: string;
	benchmarkNav: number;
	bmReturns1Month: number;
	bmReturns3Month: number;
	bmReturns6Month: number;
	bmReturns1yr: number;
	bmReturns3yr: number;
	bmReturns5yr: number;
	aum: number;
	exitLoadFlag: string;
	exitLoadValue: string;
	expenseRatio: number;
	taxBefore3Yrs: string;
	taxAfter3Yrs: string;
	crisilRating: number;
	morningstarRating: number;
	valueResearchRating: number;
	fundManagerInfo: FundManagerInfoEntity[];
	riskoMeterCode: number;
	riskoMeterValue: string;
	amcInfoUrl: string;
	sipMinInstallmentNo: number;
	sipMaxInstallmentNo: number;
	isSipAllowed: 'Y' | 'N';
	sipMultiplierAmount: number;
	sipMaxAmount: number;
	sipFrequency: string;
	sipDate: string;
	sipAllowedDays: string;
	lumpsumMaxAmount: number;
	isLumpsumAllowed: 'Y' | 'N';
	lumpsumMultiplierAmount: number;
	redeemMultiplierAmount: number;
	minimumRedeemAmount: number;
	maximumRedeemAmount: number;
	taxImplications: TaxImplication[];
	additionalPurchaseAmount: number;
	isFavourite: boolean;
	nfoStartDate: number;
	nfoEndtDate: number;
	nfoScheme: 'Y' | 'N';
	minPurchaseAmount: number;
	noOfClientInvested: number;
	swpFlag: string;
	stpFlag: string;
	switchFlag: string;
	isCartItem: boolean;
	nfoAllotmentDate: number;
	nfoEndDate: number;
}

export interface SchemeHoldings {
	companyName: string;
	percentageHold: number;
	sector: string;
}

export interface SectorHoldings {
	sector: string;
	percentage: number;
}

export interface SchemeDetailsContext {
	getSchemeDetails: () => Promise<SchemeDetails>;
	getHoldingData: () => Promise<SchemeHoldings>;
}
