import { addCommasToAmountString } from './formatAmount';

export const getInvestmentType = (data) => {
	const investmentType =
		data?.investmentType ||
		(data?.isSipAllowed?.toUpperCase() === 'Y' && data?.sipMaxAmount > 0
			? 'SIP'
			: data?.isLumpsumAllowed?.toUpperCase() === 'Y' && data?.lumpsumMaxAmount > 0
			? 'LUMPSUM'
			: '');
	return investmentType;
};

export const setErrorMessage = (data, activeTab, amount) => {
	let errorMessage = '';
	if (!amount?.length || !Number(amount)) {
		errorMessage = 'Amount should be more than 0';
		return errorMessage;
	}

	if (activeTab === 'SIP') {
		if (parseInt(amount) < data?.minSipAmount) {
			errorMessage =
				'Min SIP Amount: ₹' +
				(addCommasToAmountString(data?.minSipAmount?.toString()) || data?.minSipAmount);
		} else if (parseInt(amount) > data?.sipMaxAmount) {
			errorMessage =
				'Max SIP Amount: ₹' +
				(addCommasToAmountString(data?.sipMaxAmount?.toString()) || data?.sipMaxAmount);
		} else if (parseInt(parseInt(amount) % data?.sipMultiplierAmount)) {
			errorMessage = `Please invest in multiples of ₹${data?.sipMultiplierAmount}`;
		} else {
			errorMessage = '';
		}
	} else if (activeTab === 'ONETIME' || activeTab === 'LUMPSUM') {
		if (parseInt(amount) < data?.minPurchaseAmount) {
			errorMessage =
				'Min Investment Amount: ₹' +
				(addCommasToAmountString(data?.minPurchaseAmount?.toString()) || data?.minPurchaseAmount);
		} else if (data?.lumpsumMaxAmount > 0 && parseInt(amount) > data?.lumpsumMaxAmount) {
			errorMessage =
				'Max Investment Amount: ₹' +
				(addCommasToAmountString(data?.lumpsumMaxAmount?.toString()) || data?.lumpsumMaxAmount);
		} else if (parseInt(parseInt(amount) % data?.lumpsumMultiplierAmount)) {
			errorMessage = `Please invest in multiples of ₹${data?.lumpsumMultiplierAmount}`;
		} else {
			errorMessage = '';
		}
	}
	return errorMessage;
};
