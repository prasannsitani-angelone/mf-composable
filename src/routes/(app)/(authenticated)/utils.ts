export const getWorkflowFromNavigationUrl = (
	url: string,
	searchParams: URLSearchParams
): string => {
	if (url.includes('investments')) {
		return 'Portfolio';
	}

	if (url.includes('orders')) {
		return 'Orders';
	}

	if (url.includes('schemes')) {
		if (searchParams.get('orderpad') === 'INVEST') {
			return 'OrderPad';
		} else {
			return 'FundDetails';
		}
	}

	if (url.includes('buyPortfolio')) {
		return 'BuyPortfolio';
	}

	return '';
};
