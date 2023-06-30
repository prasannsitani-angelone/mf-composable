export interface IOrderDetails {
	amount: number;
	arqRating: number;
	bankAccountNo: string;
	bankName: string;
	category: string;
	createdTs: number;
	firstOrder: string;
	folioNumber: string;
	investmentType: string;
	isin: string;
	logoUrl: string;
	mandateRefNo: string;
	nav: number;
	orderId: number;
	paymentMode: string;
	paymentRemarks: string;
	paymentStatus: string;
	pgTxnId: string;
	quantity: number;
	reInvestmentPlan: string;
	redeemAll: boolean;
	remarks: string;
	scheduledTs: number;
	schemeCode: string;
	schemeName: string;
	schemePlan: string;
	schemeType: string;
	sipId: number;
	status: string;
	statusHistory?: [
		{
			currentState: boolean;
			description: string;
			estimate: boolean;
			failed: boolean;
			status: string;
			timeStamp: number;
			message?: string;
		}
	];
	subBrokerCode: string;
	subCategory: string;
	transactionRefNumber: string;
	transactionType: string;
	settlementType?: string;
	isNfoClosed?: boolean;
	units: number;
	updatedTs: number;
	toIsin: string;
	toSchemeCode: string;
	toSchemeName: string;
	toSchemePlan: string;
	toSchemeLogoUrl: string;
	ExpectedNavDate: number;
	actualNavDate: number;
}
