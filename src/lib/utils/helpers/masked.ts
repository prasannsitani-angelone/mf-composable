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
