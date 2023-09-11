export const handleTransactionResponse = async (params) => {
	const { transactionResponse, failureCallback, pendingCallback } = params;
	if (transactionResponse.ok) {
		if (transactionResponse.data?.data?.status === 'registration_failed') {
			await failureCallback();
			throw new Error('');
		} else if (transactionResponse.data?.data?.status === 'registration_initiated') {
			await pendingCallback();
			throw new Error('');
		}
	} else {
		await pendingCallback();
		throw new Error('');
	}
};

export const handleEmandateResponse = (params) => {
	const { response, stopLoading, onError, resetState } = params;
	if (!response?.ok) {
		resetState();
		stopLoading();
		if (response?.data?.error_code === 'ERROR-API-MANDATE-NOT-SUPPORTED') {
			onError({
				heading: 'Autopay Currently Unavailable',
				errorSubHeading:
					'Autopay is temporarily unavailable. Please try again later from the SIPs section.'
			});
		} else {
			onError({
				heading: 'Autopay Setup Failed',
				errorSubHeading:
					response?.data?.message ||
					'We were unable to set up your autopay due to a technical issue. Please try again'
			});
		}
		throw new Error('');
	}
};

export const handleUPIValidationResponse = (params) => {
	const { onUPIValidationFailure, upiValidationResponse } = params;
	if (upiValidationResponse.ok && !upiValidationResponse.data?.data?.valid) {
		onUPIValidationFailure('Please enter valid UPI ID');
		throw new Error('');
	} else if (upiValidationResponse.ok && !upiValidationResponse.data?.data?.auto_pay_eligible) {
		onUPIValidationFailure('UPI ID not eligible for mandate creation');
		throw new Error('');
	} else if (!upiValidationResponse.ok) {
		onUPIValidationFailure(
			upiValidationResponse.data?.message ||
				upiValidationResponse.data?.data?.message ||
				'Something went wrong'
		);
		throw new Error('');
	}
};
