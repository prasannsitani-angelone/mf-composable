export interface FAQ {
	contentType: string;
	question: string;
	content: string;
}

export interface FaqParams {
	params: string;
	viewAll?: string;
}

export interface decodedFaqParams {
	tag: string;
	orderId?: number;
	Status?: string;
	showRecentOrders?: boolean;
}
