export interface IUserDetails {
	subBrokerTag?: string;
	userType: 'B2C' | 'B2B';
	arn?: string;
	euin?: string;
	isARNExpired?: string;
	panSeeded: boolean;
	isKycInProgress: boolean;
	cohort: Array<string>;
}
