export const stringToFloat = (val: string): number => {
	try {
		return parseFloat(val);
	} catch (err) {
		return NaN;
	}
};

export const stringToInteger = (val: string): number => {
	try {
		return parseInt(val);
	} catch (err) {
		return NaN;
	}
};
