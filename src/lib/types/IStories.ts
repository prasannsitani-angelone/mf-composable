export interface Video {
	videoId: number;
	videoUrl: string;
	videoFallbackUrl: string;
}

export interface Story {
	storyId: number;
	title: string;
	videos: Array<Video>;
	imageThumbnailUrl: string;
	smallThumbnailUrl: string;
	ctaType: string;
	ctaText: string;
	ctaUrl: string;
}

export interface StoriesData {
	stories: Array<Story>;
}

export interface videoCtaUrls {
	videoId: number;
	ctaList: {
		B2C_D?: string;
		B2C_P?: string;
		B2B_D?: string;
		B2B_P?: string;
		genericUrl?: string;
	};
}

export interface videoQuery {
	storyPlayer: string;
}
