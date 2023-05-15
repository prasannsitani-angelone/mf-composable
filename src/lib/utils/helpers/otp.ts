export const formatOtpValue = (otp: string) => {
	const formattedOtp = otp
		?.trim() // trim
		?.replace(/[^0-9]/g, ''); // remove alphabets (to save only numeric characters)

	return formattedOtp;
};
