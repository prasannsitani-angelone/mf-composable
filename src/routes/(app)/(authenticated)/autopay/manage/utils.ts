export const getSipAmountWithoutMandate = (data, permanentAmount = 0) => {
	if (permanentAmount) {
		return {
			totalAmount: permanentAmount,
			mandateAmount: permanentAmount
		};
	}

	let totalAmount = 0;
	let mandateAmount = 0;

	(data?.sips || []).forEach((element) => {
		if(!element.mandateRefId){
			mandateAmount = Math.max(element.installmentAmount, mandateAmount);
			totalAmount += element.installmentAmount
		}
	});

	return {
		totalAmount,
		mandateAmount
	};
};
