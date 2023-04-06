export interface InvestmentEntity {
	schemeCode: string;
	isin: string;
	schemeName: string;
	settlementType: string;
	logoUrl: string;
	schemePlan: string;
	sipEnabled: boolean;
	currentValue: number;
	investedValue: number;
	returnsValue: number;
	returnsAbsolutePer: number;
	xirrPer: number;
	totalUnitsAllocated: number;
	averageNav: number;
	currentNav: number;
	folioNumbers: string[];
	nextSipDate: number;
	investmentAllowed: boolean;
	redemptionAllowed: boolean;
	redemableAmount: number;
	minimumRedeemAmount: number;
	amcCode: number;
	switchFlag: string;
	stpFlag: string;
	swpFlag: string;
	datasource: string;
	nfoScheme: string;
}

export interface OrdersSummary {
	totalFailedOrders: number;
	totalProcessingOrders: number;
	totalScheduledOrders: number;
}

export interface ProtfolioDataEntity {
	countIdentifier: keyof OrdersSummary;
	orderCountStyles?: string;
	title: string;
	orders: OrdersEntity[];
	textString: string;
	status?: string;
	orderType: string;
}

export interface ProtfolioData {
	inProgress: ProtfolioDataEntity;
	upComing: ProtfolioDataEntity;
	failed: ProtfolioDataEntity;
}

export interface OrdersEntity {
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
	statusHistory: any;
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
	clientCode: string;
	settlementType: string;
	toSettlementType: string;
}
