export interface CategoryNavItem extends CategoryDetailsModalData {
	href: string;
	title: string;
	id: string;
}

export interface CategoryDetailsModalData {
	shortDescription: string;
	detailedDescription: Array<string>;
}
