export interface SubHeadingArr {
	text: string;
	class: string;
}

export interface StatusHistoryItem {
	status?: string;
	title?: string;
	subTitle?: string;
	currentState?: boolean;
	message?: string;
	bgColorPending?: boolean;
	textColorPending?: boolean;
	orderStatusItems?: boolean;
	showSubTitle?: boolean;
}

export interface SchemeCardItems {
	value: string;
	title: string;
}

export interface SIPData {
	startDate?: string;
}
