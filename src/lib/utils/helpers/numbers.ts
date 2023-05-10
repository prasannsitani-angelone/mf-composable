export const stringToFloat = (val: string): number => {
	try {
		return parseFloat(val);
	} catch (err) {
		return NaN;
	}
};
