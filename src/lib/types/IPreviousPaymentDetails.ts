export interface IPreviousPaymentDetails {
	ok: boolean;
	data: {
		accountNo: string;
		bankName: string;
		paymentMode: string;
		upiId: string;
	};
}
