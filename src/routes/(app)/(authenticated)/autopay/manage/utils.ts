export const getSipAmountWithoutMandate = (data, amount = 0) => {
	let totalAmount = 0;
	let mandateAmount = 0;

	(data?.sips || []).forEach((element) => {
		if(!element.mandateRefId){
			mandateAmount = Math.max(element.installmentAmount, mandateAmount);
			totalAmount += element.installmentAmount
		}
	});

	if(amount){
		mandateAmount = amount
	}

	return {
		totalAmount,
		mandateAmount
	};
};
