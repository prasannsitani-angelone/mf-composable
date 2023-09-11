export const getSipAmountWithoutMandate = (data, permanentAmount = 0) => {
	if (permanentAmount) {
		return {
			totalAmount: permanentAmount,
			mandateAmount: permanentAmount
		};
	}

	let totalAmount = 0;
	let mandateAmount = 0;

	totalAmount = data?.bookOverView?.totalSipInstallmentAmount || 0;

	(data?.sips || []).forEach((element) => {
		mandateAmount = Math.max(element.installmentAmount, mandateAmount);
	});

	return {
		totalAmount,
		mandateAmount
	};
};
