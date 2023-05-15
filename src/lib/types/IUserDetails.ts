interface IUserDetails {
	subBrokerTag?: string;
	userType: 'B2C' | 'B2B';
	arn?: string;
	euin?: string;
	isARNExpired?: string;
}
