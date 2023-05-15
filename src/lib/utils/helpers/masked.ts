export const getMaskedEmail = (email: string) => {
	if (!email?.length) {
		return '';
	}

	const prefixLength = 4;

	const [username, domain] = email.split('@');
	const { length } = username;
	const maskedUsername = username?.slice(0, prefixLength) + '*'.repeat(length - prefixLength);
	const maskedEmail = maskedUsername + '@' + domain;

	return maskedEmail;
};

/**
 * getMaskedMobileNumber: Returns masked mobile number with format (******XXXX)
 *
 * @param {string} mobileNumber
 * @param {boolean} isDialingCodePresent
 * @returns {string}
 */
export const getMaskedMobileNumber = (mobileNumber: string, isDialingCodePresent = false) => {
	if (!mobileNumber?.length) {
		return '';
	}

	let prefixLength = 6;

	if (isDialingCodePresent) {
		prefixLength = 9;
	}

	const postfix = mobileNumber.substring(prefixLength, mobileNumber.length);

	let numberOfStars = prefixLength;

	if (!mobileNumber?.length || numberOfStars < 0) {
		numberOfStars = 1;
	}

	const maskedMobileNumber = '*'.repeat(numberOfStars) + postfix;

	return maskedMobileNumber;
};

/**
 * getMaskedMobileNumberSuffix: Returns masked mobile number with format (XX********)
 *
 * @param {string} mobileNumber
 * @param {boolean} isDialingCodePresent
 * @returns {string}
 */
export const getMaskedMobileNumberSuffix = (mobileNumber: string, isDialingCodePresent = false) => {
	if (!mobileNumber?.length) {
		return '';
	}

	let prefixLength = 2;

	if (isDialingCodePresent) {
		prefixLength = 5;
	}

	const prefix = mobileNumber.substring(0, prefixLength);

	let numberOfStars = mobileNumber.length - prefixLength;

	if (!mobileNumber?.length || numberOfStars < 0) {
		numberOfStars = 1;
	}

	const maskedMobileNumber = prefix + '*'.repeat(numberOfStars);

	return maskedMobileNumber;
};
