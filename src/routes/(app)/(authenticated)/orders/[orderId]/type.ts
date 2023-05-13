export interface IStatusItem {
	title: string;
	value: string;
	informationIcon?: boolean;
	informationHeading?: string;
	informationSubheading?: string;
	copyIcon?: boolean;
	node?: boolean;
}

export type IStatusObject = { [key: string]: IStatusItem };
