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
}
