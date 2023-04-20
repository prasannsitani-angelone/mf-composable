import type { DateTagClasses } from './ICalendar';

export interface DateTagTypes {
	value: number;
	disabled: boolean;
	selected: boolean;
	classes?: DateTagClasses;
}
