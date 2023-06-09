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
