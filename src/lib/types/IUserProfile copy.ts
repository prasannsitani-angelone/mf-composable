export interface UserProfile {
	applicationNo?: string;
	clientId: string;
	pan?: string;
	countryCode?: string;
	mobile?: string;
	active?: boolean;
	clientAccountType?: string;
	clientAccountSubType?: string;
	userType: string;
	dpNumber: string;
	poaStatus?: string;
	ddpiStatus?: boolean;
	clientDetails?: ClientDetails;
	activeSegments?: ActiveSegments;
	bankDetails?: BankDetailsEntity[] | null;
	dpDetails?: DpDetails;
	brokerageType?: string;
	nomineeDetails?: NomineeDetailsEntity[] | null;
	creationDate?: string;
	modificationDate?: string;
	modifiedBy?: string;
	dpcFlag?: boolean;
	inactiveDate?: string;
	deactiveReason?: string;
	products?: Products;
}
export interface ClientDetails {
	fullName: string;
	firstName: string;
	middleName: string;
	lastName: string;
	fatherName: string;
	email: string;
	branch: string;
	subBroker: string;
	shortName: string;
	birthdate: string;
	gender: string;
	tradingPlatform: string;
	dcName: string;
	address: string;
	permanentAddress: PermanentAddressOrCorrespondenceAddress;
	correspondenceAddress: PermanentAddressOrCorrespondenceAddress;
	zip: string;
	rmDealerPhone: string;
	contactUsPhone: string;
}
export interface PermanentAddressOrCorrespondenceAddress {
	addressLine1: string;
	addressLine2: string;
	addressLine3: string;
	city: string;
	state: string;
	country: string;
	pincode: string;
}
export interface ActiveSegments {
	equity: boolean;
	futures: boolean;
	currency: boolean;
	commodity: boolean;
	mutualFund: boolean;
	ipo: boolean;
	NSX: boolean;
	BSX: boolean;
	MCX: boolean;
	MCD: boolean;
	BSE: boolean;
	NSE: boolean;
	NCX: boolean;
	BSEFO: boolean;
	NSEFO: boolean;
}
export interface BankDetailsEntity {
	bankName: string;
	branchName: string;
	accNO: string;
	accountType: string;
	ifscCode: string;
	micrCode: string;
	isNetBanking: boolean;
	isDefalutID: boolean;
	bankLogo: string;
}
export interface DpDetails {
	dpIdNo: string;
	dpType: string;
	dpIdStatus: string;
	boAccountNo: string;
	dpName: string;
	dpSchemeName: string;
}

export interface Products {
	intraday: IntradayOrMtf;
	mtf: IntradayOrMtf;
	commodityOptions: CommodityOptions;
}
export interface IntradayOrMtf {
	status: string;
	activationDate: string;
}
export interface CommodityOptions {
	status: string;
}
