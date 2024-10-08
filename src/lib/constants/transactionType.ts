export const INVESTMENT_TYPE = {
	REDEEM: 'REDEEM',
	SWITCH_OUT: 'SWITCH OUT',
	SWITCH_IN: 'SWITCH IN',
	SIP: 'SIP',
	LUMPSUM: 'LUMPSUM',
	SWP: 'SWP'
};

export const REVERSE_INVESTMENT_TYPE: { [key: string]: string } = {
	'ONE-TIME': 'LUMPSUM',
	SIP: 'SIP',
	WITHDRAWAL: 'REDEEM'
};

export const TRANSACTION_MAP: { [key: string]: string } = {
	REDEEM: 'Withdrawal',
	'SWITCH OUT': 'Switch',
	SIP: 'SIP',
	XSIP: 'SIP',
	LUMPSUM: 'One Time',
	SWITCH: 'Switch',
	SWP: 'SWP'
};

export const TRANSACTION_TYPE = {
	PURCHASE: 'PURCHASE',
	REDEEM: 'REDEEM',
	SWITCH: 'SWITCH'
};

export const OrderType = {
	SWITCH: 'SWITCH',
	LUMPSUM: 'LUMPSUM',
	SIP: 'SIP',
	REDEEM: 'REDEEM'
};
