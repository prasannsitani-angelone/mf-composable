function numericValidator(name = '', minValue = 0, maxValue = 100) {
	return function quantity(value: number) {
		if (value < minValue) {
			return `${name || 'Value'} must be greater than zero`;
		} else if (value > maxValue) {
			return `${name || 'Value'} must be less than or equal to ${maxValue}`;
		}
		return true;
	};
}

function requiredValidator(name = '') {
	return function required(value: string | number) {
		return (
			(value !== undefined && value !== null && value !== '') ||
			`${name || 'This field'} is required`
		);
	};
}

export { requiredValidator, numericValidator };
