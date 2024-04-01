import type { ScreenedSchemes } from '$lib/types/Screener';

export interface IPromotion {
	header: {
		title: string;
		description?: string;
		logoUrl?: string;
		mobileBgBannerUrl?: string;
		webBgBannerUrl?: string;
		bgClour?: string;
	};
	body: object;
	schemes: ScreenedSchemes[];
}
