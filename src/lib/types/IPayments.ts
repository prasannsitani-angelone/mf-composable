export interface UserPaymentMethodsData {
	payment_modes: PaymentMethodsDataTypes;
}

export interface PaymentMethodsDataTypes {
	[key: string]: PaymentMethodsStatusTypes;
}

export interface PaymentMethodsStatusTypes {
	upi: {
		status: string;
	};
	net_banking: {
		status: string;
	};
}
