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

	if (url.includes('schemes') && searchParams.get('orderpad') === 'INVEST') {
		return 'OrderPad';
	}

	if (url.includes('buyPortfolio')) {
		return 'BuyPortfolio';
	}

	return '';
};
