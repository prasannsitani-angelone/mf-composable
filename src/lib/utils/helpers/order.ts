import { INVESTMENT_TYPE, TRANSACTION_TYPE } from '$lib/constants/transactionType';
import type { IOrderDetails } from '$lib/types/IOrderDetails';
import { format } from 'date-fns';

export const getExpectedNavDate = (data: IOrderDetails) => {
	let formattedExpectedNavDate = '-- --';
	if (
		data?.investmentType?.toUpperCase() === INVESTMENT_TYPE.SIP &&
		data?.firstOrder?.toUpperCase() === 'N' &&
		!data?.bankAccountNo?.length
	) {
		formattedExpectedNavDate = format(new Date(data?.scheduledTs), 'dd MMM yyyy');
	} else if (data?.transactionType !== TRANSACTION_TYPE.SWITCH) {
		formattedExpectedNavDate = format(new Date(data?.ExpectedNavDate * 1000), 'dd MMM yyyy');
	}
	return formattedExpectedNavDate;
};

export const getExpectedCreditDate = (data: IOrderDetails) => {
	let formattedExpectedCreditDate = '-- --';
	const bankcreditDate = data?.statusHistory?.find(
		(state: { status: string }) => state.status === 'ORDER_SENT_TO_RTA'
	)?.timeStamp;
	formattedExpectedCreditDate = format(new Date(bankcreditDate || data?.createdTs), 'dd MMM yyyy');
	return formattedExpectedCreditDate;
};

export const getTransactionDate = (
	data: IOrderDetails,
	isInvestmentSipOrXsip: boolean,
	lumpsumMandateOrder: boolean
) => {
	let transactionDate = format(new Date(data?.createdTs), 'dd MMM yyyy');

	if ((isInvestmentSipOrXsip && data?.firstOrder?.toUpperCase() === 'N') || lumpsumMandateOrder) {
		transactionDate = format(new Date(data?.scheduledTs), 'dd MMM yyyy');
	}

	return transactionDate;
};

export const calculateTransactionCharges = (amount: string) => {
	const stampDutyRate = 0.005; // Stamp Duty Rate (0.005%) is fixed for all the fund schemes

	return parseFloat(((parseFloat(amount) * stampDutyRate) / 100)?.toFixed(2));
};
