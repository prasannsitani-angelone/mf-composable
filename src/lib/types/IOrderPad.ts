export interface OrderPadTypes {
	orderpad: string;
	params: string;
	screen?: string;
}

export interface decodedParamsTypes {
	orderId?: number;
	pgTxnId?: string;
	requestId?: string;
	investmentType?: string;
	investmentAmount?: number;
	sipDate?: number;
	ftp?: boolean;
	skipOrderPad?: boolean;
	redirectedFrom?: string;
	sipId?: number;
	sipRegistrationNumber?: number;
	sipDueDate?: number;
	source?: string;
	orderpad?: string;
	paymentMandatory?: boolean;
	mandateId?: string;
	folioNumber?: string;
	sipInstalmentId?: string;
	isAdditionalFlag?: boolean;
	hideAutopayMethod?: boolean;
	require2FA?: boolean;
	homepageNudge?: boolean;
}
