export interface IEmandate {
	accountNo: string;
	availableAmount: number;
	mandateType: string;
	mandateId: string;
}

export interface AutopayTypes {
	accountNo: string;
	amount: number;
	authenticationMode: string;
	availableAmount: number;
	bankBranch: string;
	bankName: string;
	createdBy: string;
	createdFrom: string;
	createdOn: number;
	formUploadedOn: string;
	ifscCode: string;
	linkedSipsCount: number;
	mandateEndDate: string;
	mandateId: string;
	mandateStartDate: string;
	mandateStatus: string;
	mandateType: string;
	remarks: string;
	subMandateStatus: string;
	umrnNo: string;
	updatedBy: string;
	updatedOn: string;
	inProgress: boolean;
}

export interface AutopayDetailsType {
	id: number;
	mandateId: string;
	bankName: string;
	bankBranch: string;
	ifscCode: string;
	accountNo: string;
	mandateStatus: string;
	subMandateStatus: string;
	mandateType: string;
	amount: number;
	availableAmount: number;
	mandateRefNo: string;
	clientCode: string;
	createdOn: number;
	mandateStartDate: string;
	mandateEndDate: string;
	createdFrom: string;
	createdBy: string;
	umrnNo: string;
	authenticationMode: string;
	remarks: string;
	inProgress: boolean;
}

export interface MandateWithBankDetails extends AutopayTypes {
	bankLogo: string;
}
