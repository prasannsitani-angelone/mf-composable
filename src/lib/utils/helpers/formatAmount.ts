export const addCommasToAmountString = (amount: string | number) => {
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

/**
 * formatAmount: This function is to format amount string.
 *
 * This function trims the string for any leading or trailing spaces.
 * Then remove alphabets (if any).
 * And finally remove leading zeroes from the amount string.
 *
 * @param {string} amount
 * @returns {string} formattedAmount
 */
export const formatAmount = (amount: string) => {
	// formattedAmount: trim, retain only numeric characters and remove leading zeroes
	const formattedAmount = amount
		?.trim() // trim
		?.replace(/[^0-9]/g, '') // remove alphabets (to save only numeric characters)
		?.replace(/^0+/, ''); // remove leading zeroes

	return formattedAmount;
};

/**
 * getCappedUnitString: Get units in capped format (without round off)
 *
 * @param {string} units
 * @param {number} cap (default value = 3)
 * @returns {string}
 */
export const getCappedUnitString = (units = '', cap = 3) => {
	const unitString = units?.toString();

	if (!unitString?.length) {
		return '';
	}

	const [preDecimal = '', postDecimal = ''] = unitString.split('.');

	return `${preDecimal}.${postDecimal?.slice(0, cap)}`;
};

/**
 * roundOffAmountToNearestThousand
 *
 * Amount                 |   Returned Value
 * -----------------------|-----------------------
 * 1250                   |   1000
 * 1650                   |   2000
 * 24780                  |   25000
 *
 * @param {number} amount
 * @returns {number}
 */
export const roundOffAmountToNearestThousand = (amount: number) => {
	if (typeof amount === 'string') {
		amount = Number(amount);
	}

	const quotient = parseInt((amount / 1000)?.toString());
	const remainder = amount % 1000;
	let roundOffFactor = 0;

	if (remainder >= 500) {
		roundOffFactor = 1;
	}

	const resultAmount = (quotient + roundOffFactor) * 1000;

	return resultAmount;
};
