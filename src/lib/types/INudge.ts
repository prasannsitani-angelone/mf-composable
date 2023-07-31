import type { ISip } from './ISipType';

export interface INudge {
	type: string;
	heading: string;
	description: string;
	link: string;
	linkHeading: string;
	nudgesType?: string;
	data?: ISip | IRetryPaymentNudge | StartFirstSipNudgeType | Start4SipsNudgeType;
	id: string;
	amount: number;
}

export interface IRetryPaymentNudge {
	sipRegistrationNo: string;
	schemeName: string;
	sipPaymentDate: Date;
	logoUrl: string;
	schemeCode: string;
	isin: string;
	schemePlan: string;
	installmentAmount: number;
	sipId: number;
	sipAmountPayTillDate: number;
	isSipPaymentNudge: boolean;
	amount: number;
	investmentType: string;
	orderDate: string;
	sipStartDate: Date;
	orderID: number;
	pgTxnId: string;
}

export type NudgeDataType = {
	nudges: INudge[];
};

export type StartFirstSipNudgeType = {
	type: string;
	heading: string;
	description: string;
	nudgesType: string;
	data: {
		b2b: {
			isin: string;
			schemeCode: string;
		};
		b2c: {
			isin: string;
			schemeCode: string;
		};
	};
	id: string;
};

export type Start4SipsNudgeType = {
	type: string;
	heading: string;
	description: string;
	linkHeading: string;
	nudgesType: string;
	data: {
		returnPercentage: number;
	};
	id: string;
	amount: number;
};
