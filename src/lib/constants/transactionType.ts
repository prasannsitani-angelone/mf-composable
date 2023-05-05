export const INVESTMENT_TYPE = {
	REDEEM: 'REDEEM',
	SWITCH_OUT: 'SWITCH OUT',
	SIP: 'SIP',
	LUMPSUM: 'LUMPSUM'
};

export const TRANSACTION_MAP: { [key: string]: string } = {
	REDEEM: 'Withdrawal',
	'SWITCH OUT': 'Switch',
	SIP: 'SIP',
	LUMPSUM: 'Onetime',
	SWITCH: 'Switch'
};

export const TRANSACTION_TYPE = {
	PURCHASE: 'PURCHASE',
	REDEEM: 'REDEEM',
	SWITCH: 'SWITCH'
};
