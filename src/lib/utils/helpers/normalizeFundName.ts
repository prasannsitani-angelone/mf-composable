export const normalizeFundName = (
	fund: string,
	isin: string,
	schemeCode: string,
	prefix?: string
): string => {
	let result = fund?.replace(/[^a-zA-Z ]/g, '').split(' ');

	if (!result || !isin || !schemeCode) {
		// Log error
	}

	let url = '';
	if (result) {
		result = [...result, 'isin', isin, 'schemeCode', schemeCode];
		url = `${result.join('-').toLowerCase()}`;
	}

	return prefix ? `${prefix}/${url}` : url;
};
