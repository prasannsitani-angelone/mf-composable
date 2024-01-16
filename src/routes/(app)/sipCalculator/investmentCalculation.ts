interface InvestmentReturns {
	totalInvestment: number;
	capitalGain: number;
}

export const getSipReturns = (
	investedAmount: number,
	durationInYears: number,
	rateOfInterest: number
): InvestmentReturns => {
	const effectiveCAGR = rateOfInterest?.toFixed(2) / 100 / 12;
	const totalMonths = durationInYears * 12;

	const totalProfit =
		investedAmount *
		(((Math.pow(1 + effectiveCAGR, totalMonths) - 1) / effectiveCAGR) * (1 + effectiveCAGR));
	const totalInvestment = investedAmount * totalMonths;

	const capitalGain = Math.floor(totalProfit - totalInvestment);

	return { totalInvestment, capitalGain };
};

export const getLumpSumReturns = (
	investedAmount: number,
	durationInYears: number,
	rateOfInterest: number
): InvestmentReturns => {
	const totalProfit = investedAmount * Math.pow(1 + rateOfInterest / 100, durationInYears);
	const totalInvestment = investedAmount;

	const capitalGain = Math.floor(totalProfit - totalInvestment);

	return { totalInvestment, capitalGain };
};
