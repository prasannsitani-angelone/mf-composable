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

/**
 * getRoundOffAmountWithUnits: This function returns formatted amounts for large values.
 *
 * Amount                 |   Returned Value
 * -----------------------|-----------------------
 * up to 1 lac            |   returns as it is
 * 1 lac to 99.99 lac     |   3.54 L, 56.23 L
 * above 1 CR             |   2.34 Cr, 35.45 Cr
 *
 * @param {number} amount
 * @returns {string} amount
 */
export const getRoundedOffLargeAmounts = (amount: number) => {
	if (amount >= 10000000) {
		return (amount / 10000000).toFixed(2);
	} else if (amount < 10000000 && amount >= 100000) {
		return (amount / 100000).toFixed(2);
	}

	return amount?.toFixed(2);
};

/**
 * getAmountUnit: Get Amount Units.
 *
 * @param {number} amount
 * @returns {string}
 */
export const getAmountUnit = (amount: number) => {
	if (amount >= 10000000) {
		return 'Cr';
	} else if (amount < 10000000 && amount >= 100000) {
		return 'L';
	}

	return '';
};
