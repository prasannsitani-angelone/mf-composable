/**
 * calculateSipReturns: Function to get returns for SIP investment
 *
 * @param investedAmount
 * @param returnYears
 * @param CAGR
 * @returns ({ totalInvestment, totalProfit, capitalGain, gainLossPercentage, matuarityAmount })
 */
export const calculateSipReturns = (investedAmount: number, returnYears: number, CAGR: number) => {
	const effectiveCAGR = Number(CAGR?.toFixed(2)) / 100 / 12;
	const totalMonths = returnYears * 12;

	const totalInvestment = investedAmount * totalMonths;
	const totalProfit =
		investedAmount *
		(((Math.pow(1 + effectiveCAGR, totalMonths) - 1) / effectiveCAGR) * (1 + effectiveCAGR));
	const capitalGain = Math.floor(totalProfit - investedAmount);
	const gainLossPercentage = (capitalGain / investedAmount) * 100;
	const matuarityAmount = Math.floor(totalProfit) || 0;

	return { totalInvestment, totalProfit, capitalGain, gainLossPercentage, matuarityAmount };
};

/**
 * calculateLumpsumReturns: Function to get returns for one-time investment
 *
 * @param investedAmount
 * @param returnYears
 * @param CAGR
 * @returns ({ totalProfit, capitalGain, gainLossPercentage, matuarityAmount })
 */
export const calculateLumpsumReturns = (
	investedAmount: number,
	returnYears: number,
	CAGR: number
) => {
	const totalProfit = investedAmount * Math.pow(1 + CAGR / 100, returnYears);
	const capitalGain = Math.floor(totalProfit - investedAmount);
	const gainLossPercentage = (capitalGain / investedAmount) * 100;
	const matuarityAmount = Math.floor(totalProfit) || 0;

	return { totalProfit, capitalGain, gainLossPercentage, matuarityAmount };
};
