export interface NavDetails {
	amount: number;
	date: string;
}
export interface ICompareFunds {
	comparefundscardvisible: string;
	comparefundcardfunds: {
		fundName1: string;
		fundName2: string;
	};
	comparefundcardfundsISIN: {
		isin1: string;
		isin2: string;
	};
	comparefundcardfunds3YReturn: {
		return3Year1: number;
		return3Year2: number;
	};
	comparefundcardfundsMinSIPAmount: {
		minSIPAmount1: number;
		minSIPAmount2: number;
	};
	comparefundcardfundsNoofInvestors: {
		fund1Investors: number;
		fund2Investors: number;
	};
}
