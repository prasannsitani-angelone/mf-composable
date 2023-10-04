import type { SchemeHoldings } from '$lib/types/ISchemeDetails';
import type { TopHoldingSummary } from './types';

export const generateGraphDataset = (holdings: SchemeHoldings[]) => {
	const holdingDataset: TopHoldingSummary = {
		label: [],
		data: []
	};

	if (!holdings?.length) {
		return;
	}

	holdings?.forEach(({ companyName, percentageHold }) => {
		holdingDataset?.label?.push(companyName);
		holdingDataset?.data?.push(percentageHold);
	});
	return holdingDataset;
};
