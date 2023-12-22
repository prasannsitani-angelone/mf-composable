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
		return3Year1: string;
		return3Year2: string;
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
