export interface IStoryAnalytics {
	onStoryClick: (eventMetaData: object) => void;
	storyImpression: (eventMetaData: object) => void;
	onStoryClose: (eventMetaData: object) => void;
	onStorySlide?: (eventMetaData: object) => void;
}
