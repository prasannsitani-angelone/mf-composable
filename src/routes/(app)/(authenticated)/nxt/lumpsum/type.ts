export interface IOrderDetails {
	amount: number;
	requestDate: string;
	orderType: string;
	folioNumber?: string;
}

export interface IClientDetails {
	clientCode: string;
	partnerName: string;
}

export interface IMandateDetails {
	accountNo: string;
	bankName: string;
	mandateId: string;
	mandateType: string;
}
