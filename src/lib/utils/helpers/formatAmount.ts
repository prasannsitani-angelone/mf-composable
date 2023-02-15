export const addCommasToAmountString = (amount: string) => {
	let decimalValues = '';

	if (typeof amount === 'number') {
		amount = amount + '';
	}

	let amountWithoutDecimals = amount;

	const decimalIndex = amount?.indexOf('.');

	if (amount?.includes('.') && decimalIndex > -1) {
		decimalValues = amount?.substring(amount?.length - (amount?.length - decimalIndex));
		amountWithoutDecimals = amount?.slice(0, amount?.length - (amount?.length - decimalIndex));
	}

	let lastThreeDigits = amountWithoutDecimals?.substring(amountWithoutDecimals.length - 3);

	const otherDigits = amountWithoutDecimals?.substring(0, amountWithoutDecimals.length - 3);

	if (otherDigits !== '') {
		lastThreeDigits = ',' + lastThreeDigits;
	}

	return otherDigits?.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThreeDigits + decimalValues;
};
