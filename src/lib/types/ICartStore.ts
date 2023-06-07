import type { WeeklyTopSchemesEntity } from './IDiscoverFunds';
export interface RemoveCartItem {
	schemeName: string;
	cartItemId: number;
}

export interface ICartStore {
	item: WeeklyTopSchemesEntity[];
	count: number;
	repetetiveAddAttempt: boolean;
	removeFromCart: boolean;
	currentSelection: WeeklyTopSchemesEntity | RemoveCartItem | null;
	addToCartRequestedFromModal: boolean;
}
