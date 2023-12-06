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
	sipInstalmentId?: string;
	sipPaymentMonthNudge?: boolean;
	orderDate?: number;
	packId?: string;
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
	FundName?: string;
	Amount: number;
	SipPaymentDue: number;
	SipDate: string;
	PayBefore: string;
	SipCount?: string;
}

export interface IInvestmentTypeSIP {
	sipId: number;
	clientCode: string;
	sipType: string;
	schemeCode: string;
	isin: string;
	frequency: string;
	installmentAmount: number;
	startDate: string;
	mandateRefId: string;
	subBrokerCode: string;
	firstOrderToday: boolean;
	createdTs: number;
	status: string;
	schemePlan: string;
	bankName: string;
	accountNo: string;
	schemeName: string;
	logoUrl: string;
	nextSipDueDate: number;
	isSipInprocess: boolean;
	sipRegistrationNo: string;
	category: string;
	subCategory: string;
	arqRating: number;
	reInvestmentPlan: string;
	isSipPaymentNudge: boolean;
	sipPaymentDate: number;
	sipAmountPayTillDate: number;
	sipStatus: string;
	installmentSkip: boolean;
	skipSipDueDate: number;
	paymentNudgeSkip: boolean;
}

export interface ISipHealth {
	score: number;
	scorePercentile: number;
	autoPayEnabled: boolean;
	pecrcentageOfInstalmentPaid: number;
	noOfSkippedInstalments: number;
	noOfFailedInstalments: number;
	noOfSuccessfulInstalmnets: number;
	totalInstalments: number;
	betterThanOthers: number;
	completedSiphealth: number;
	paidSipPercentHealth: number;
	autoPayHealth: number;
}

export interface ISipHealthDetails {
	title: string;
	description: string;
	icon: string;
	showFooter?: boolean;
	footerType?: string;
	titleTag?: string;
}

export interface IReturnsProjectedGraphDataTypes {
	type: string;
	amount: number;
	returnPercentage: number;
	xAxisTitle1: string;
	xAxisTitle2?: string;
	barHeight: number;
}
