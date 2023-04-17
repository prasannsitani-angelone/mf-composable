import type { TableDataTypes } from '$lib/types/IPortfolioDetails';
export const generateGraphDataset = (holdings: TableDataTypes[]) => {
	const holdingDataset = {
		label: [],
		data: []
	};
	const topHoldingLength = 6;
	const sortedHolding = (holdings || [])?.sort((a, b) =>
		a.percentageHold > b.percentageHold ? -1 : 1
	);
	const topHolding = sortedHolding?.slice(0, topHoldingLength);

	let topHoldingPercentage = 0;

	topHolding?.forEach((holding) => {
		topHoldingPercentage += holding.percentageHold;
	});

	topHolding?.forEach(({ category, percentageHold }) => {
		holdingDataset?.label?.push(category);
		holdingDataset?.data?.push(percentageHold?.toFixed(2));
	});
	return holdingDataset;
};
