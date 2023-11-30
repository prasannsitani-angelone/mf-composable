export interface PortfolioPack {
	packId: string;
	packName: string;
	packLogoUrl: string;
	description: string;
	minSipAmount: number;
	threeYrReturnAvgPer: number;
	totalUsersInvested: number;
	benefits: Benefit[];
	features: Feature[];
	schemes: Scheme[];
}

interface Benefit {
	description: string;
}

interface Feature {
	name: string;
	description: string;
	highlight: string;
}

interface Scheme {
	isin: string;
	schemeCode: string;
	schemeName: string;
	logoUrl: string;
	weightage: number;
	wieightPercentage: number;
	subCategory: string;
	sipMaxInstallmentNo: number;
	sipMaxAmount: number;
	sipFrequency: string;
	minSipAmount: number;
	returns3yr: number;
	noOfClientInvested: number;
	riskoMeterValue: string;
}
