export interface DateObj {
	value: number;
	disabled: boolean;
}

export interface DateTagClasses {
	default: string;
	disabled: string;
	selected: string;
}

export interface Classes {
	title?: string;
	header?: string;
	midBorder?: string;
	content?: string;
	footer?: string;
	dateTag?: DateTagClasses;
}

export interface CalendarProps {
	heading?: string;
	visible?: boolean;
	showClose?: boolean;
	showSubmit?: boolean;
	dateArray: Array<DateObj>;
	defaultValue?: number;
	title?: string;
	classes?: Classes;
}

export interface dateArrayTypes {
	value: number;
	disabled: boolean;
}
