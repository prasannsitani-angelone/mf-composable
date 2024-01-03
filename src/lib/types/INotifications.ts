export type INotificationSummary = {
	summary: Summary[];
	totalCount: number;
};

export type Summary = {
	count: number;
	type: string;
};

export type INotification = {
	instalmentFailedOrders: Notif[];
	paymentFailedOrders: Notif[];
	instalmentPending: Notif[];
};

export type Notif = {
	sipRegistrationNo: string;
	schemeName: string;
	sipPaymentDate: Date;
	logoUrl: string;
	schemeCode: string;
	isin: string;
	schemePlan: string;
	installmentAmount: number;
	sipId: number;
	sipAmountPayTillDate: number;
	isSipPaymentNudge: boolean;
	amount: number;
	investmentType: string;
	orderDate: number;
	sipStartDate: Date;
	orderID: number;
	pgTxnId: string;
};
