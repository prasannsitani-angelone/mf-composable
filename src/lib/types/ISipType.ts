export interface ISipBookData {
	bookOverView: ISipBookOverView;
	sips: Array<ISip>;
	summary: ISipBookSummary;
}

export interface ISipBookOverView {
	TotalStpOrder?: number;
	totalSipInstallmentAmount: number;
	totalSipOrder: number;
	totalStpInstallmentAmount?: number;
	totalSwpInstallmentAmount?: number;
	totalSwpOrder?: number;
}

export interface ISip {
	accountNo: string;
	arnNumber: string;
	bankName: string;
	clientCode: string;
	createdBy: string;
	createdTs: number;
	dpId: string;
	endDate: string;
	euinNumber: string;
	firstOrderToday: boolean;
	folioNumber: string;
	frequency: string;
	installmentAmount: number;
	installmentNo: number;
	isSipInprocess: boolean;
	isin: string;
	logoUrl: string;
	mandateRefId: string;
	nextSipDueDate: number;
	platform: string;
	purchaseTxnMode: string;
	schemeCode: string;
	schemeName: string;
	schemePlan: string;
	sipId: number;
	sipOrderHistory: Array<SipOrderHistoryTypes>;
	sipRegistrationNo: string;
	sipType: string;
	startDate: string;
	status: string;
	subBrokerCode: string;
	transactionMode: string;
	category?: string;
	subCategory?: string;
	arqRating?: number;
	reInvestmentPlan?: string;
	sipPaymentDate: number;
	sipAmountPayTillDate: number;
	isSipPaymentNudge: boolean;
	installmentSkip: boolean;
	skipSipDueDate: string;
}

export interface ISipOrderHistory {
	Message: string;
	orderCompletionTs: number;
	orderStatus: string;
}

export interface ISipBookSummary {
	totalSIP: number;
	totalSTP: number;
	totalSWP: number;
	totalInActiveSip: number;
}

export interface IInactiveSip {
	accountNo: string;
	bankName: string;
	cancelledTs: number;
	clientCode: string;
	installmentAmount: number;
	isExpiredSip: boolean;
	logoUrl: string;
	Isin: string;
	schemeCode: string;
	schemeName: string;
	schemePlan: string;
	sipId: number;
	sipType: string;
}

export interface IDueSips {
	FundName: string;
	Amount: number;
	SipPaymentDue: number;
	SipDate: string;
	PayBefore: string;
}
