export interface OrderPadTypes {
	orderpad: string;
	params: string;
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
}
