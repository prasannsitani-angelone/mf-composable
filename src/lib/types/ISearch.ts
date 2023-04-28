import type { WeeklyTopSchemesEntity } from './IDiscoverFunds';

export interface ISearchOptionItem {
	iconUrl: string;
	id: string;
	name: string;
}

export interface IDashBoardData {
	recentlyViewed: WeeklyTopSchemesEntity[];
	topInvestSchemes: WeeklyTopSchemesEntity[];
	searchOptions: ISearchOptionItem[];
}

export interface ISearchHeaderProps {
	defaultTitle?: string;
	ctaTitle?: string;
	subtitle?: string;
	subtitleRight?: string;
}
