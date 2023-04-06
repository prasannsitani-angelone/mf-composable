export interface orderItem {
	orderId: number;
	transactionType: string;
	investmentType: string;
	schemeCode: string;
	isin: string;
	amount: number;
	quantity: number;
	redeemAll: boolean;
	folioNumber: string;
	transactionRefNumber: string;
	pgTxnId: string;
	paymentMode: string;
	status: string;
	remarks: string;
	nav: number;
	units: number;
	sipId: number;
	subBrokerCode: string;
	paymentRemarks: string;
	paymentStatus: string;
	firstOrder: string;
	statusHistory: Array<StatusHistoryTypes>;
	createdTs: number;
	updatedTs: number;
	scheduledTs: number;
	arqRating: number;
	schemeName: string;
	schemePlan: string;
	schemeType: string;
	category: string;
	subCategory: string;
	logoUrl: string;
	reInvestmentPlan: string;
	bankAccountNo: string;
	bankName: string;
	mandateRefNo: string;
	ExpectedNavDate: number;
	nfoScheme: string;
}

export interface StatusHistoryTypes {
	currentState: boolean;
	description: string;
	estimate: boolean;
	failed: boolean;
	status: string;
	timeStamp: number;
}
