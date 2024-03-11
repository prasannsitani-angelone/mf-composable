import type { StoriesData, videoCtaUrls } from '$lib/types/IStories';

export const videoCtaList: Array<videoCtaUrls> = [
	{
		videoId: 1,
		ctaList: {
			genericUrl: '/categories?id=106&type=categories'
		}
	},
	{
		videoId: 2,
		ctaList: {
			genericUrl: '/categories?id=103'
		}
	},
	{
		videoId: 4,
		ctaList: {
			B2C_D:
				'/schemes/hdfc-balanced-advantage-fund-growth-plan-direct-plan-isin-inf179k01wa6-schemecode-gfgt-gr',
			B2C_P:
				'/schemes/hdfc-balanced-advantage-fund-growth-plan-direct-plan-isin-inf179k01wa6-schemecode-gfgt-gr',
			B2B_D:
				'/schemes/hdfc-balanced-advantage-fund-growth-plan-isin-inf179k01830-schemecode-gfg-hdfc',
			B2B_P:
				'/schemes/hdfc-balanced-advantage-fund-growth-plan-isin-inf179k01830-schemecode-gfg-hdfc',
			genericUrl: ''
		}
	},
	{
		videoId: 5,
		ctaList: {
			B2C_D:
				'/schemes/motilal-oswal-midcap-fund-direct-plan-growth-isin-inf247l01445-schemecode-mofmgd-gr',
			B2C_P:
				'/schemes/motilal-oswal-midcap-fund-direct-plan-growth-isin-inf247l01445-schemecode-mofmgd-gr',
			B2B_D:
				'/schemes/motilal-oswal-midcap-fund-regular-plan-growth-isin-inf247l01411-schemecode-fmgp-gr',
			B2B_P:
				'/schemes/motilal-oswal-midcap-fund-regular-plan-growth-isin-inf247l01411-schemecode-fmgp-gr',
			genericUrl: ''
		}
	}
];

export const storiesDataObjectWithoutUrls: StoriesData = {
	stories: [
		{
			storyId: 1,
			title: 'Start a SIP',
			videos: [
				{
					videoId: 1,
					videoUrl: '/videos/video1c5/playlist.m3u8',
					videoFallbackUrl: 'https://cdn.angelone.in/mutualfunds/videos/video1c5.mp4'
				}
			],
			imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail1c2.jpg',
			smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail1c3.jpg',
			ctaType: '',
			ctaText: 'START SIP NOW',
			ctaUrl: ''
		},
		{
			storyId: 2,
			title: 'Index Funds!',
			videos: [
				{
					videoId: 2,
					videoUrl: '/videos/video2c5/playlist.m3u8',
					videoFallbackUrl: 'https://cdn.angelone.in/mutualfunds/videos/video2c5.mp4'
				}
			],
			imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail2c2.png',
			smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail2c3.png',
			ctaType: '',
			ctaText: 'START SIP NOW',
			ctaUrl: ''
		},
		{
			storyId: 4,
			title: 'All Season Fund',
			videos: [
				{
					videoId: 4,
					videoUrl: '/videos/video4c4/playlist.m3u8',
					videoFallbackUrl: 'https://cdn.angelone.in/mutualfunds/videos/video4c4.mp4'
				}
			],
			imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail4c1.webp',
			smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail4c2.webp',
			ctaType: '',
			ctaText: 'START SIP NOW',
			ctaUrl: ''
		},
		{
			storyId: 5,
			title: 'Trending Mid Cap!',
			videos: [
				{
					videoId: 5,
					videoUrl: '/videos/video5c1/playlist.m3u8',
					videoFallbackUrl: 'https://cdn.angelone.in/mutualfunds/videos/video5c1.mp4'
				}
			],
			imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail5c1.png',
			smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail5c1.png',
			ctaType: '',
			ctaText: 'START SIP NOW',
			ctaUrl: ''
		}
	]
};

export const setStoriesData = (getCtaUrlCallback: (vidId: number) => string) => {
	const storiesDataObject: StoriesData = {
		stories: [
			{
				storyId: 1,
				title: 'Start a SIP',
				videos: [
					{
						videoId: 1,
						videoUrl: '/videos/video1c5/playlist.m3u8',
						videoFallbackUrl: 'https://cdn.angelone.in/mutualfunds/videos/video1c5.mp4'
					}
				],
				imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail1c2.jpg',
				smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail1c3.jpg',
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: getCtaUrlCallback(1)
			},
			{
				storyId: 2,
				title: 'Index Funds!',
				videos: [
					{
						videoId: 2,
						videoUrl: '/videos/video2c5/playlist.m3u8',
						videoFallbackUrl: 'https://cdn.angelone.in/mutualfunds/videos/video2c5.mp4'
					}
				],
				imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail2c2.png',
				smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail2c3.png',
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: getCtaUrlCallback(2)
			},
			{
				storyId: 4,
				title: 'All Season Fund',
				videos: [
					{
						videoId: 4,
						videoUrl: '/videos/video4c4/playlist.m3u8',
						videoFallbackUrl: 'https://cdn.angelone.in/mutualfunds/videos/video4c4.mp4'
					}
				],
				imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail4c1.webp',
				smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail4c2.webp',
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: getCtaUrlCallback(4)
			},
			{
				storyId: 5,
				title: 'Trending Mid Cap!',
				videos: [
					{
						videoId: 5,
						videoUrl: '/videos/video5c1/playlist.m3u8',
						videoFallbackUrl: 'https://cdn.angelone.in/mutualfunds/videos/video5c1.mp4'
					}
				],
				imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail5c1.png',
				smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail5c1.png',
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: getCtaUrlCallback(5)
			}
		]
	};

	return storiesDataObject;
};
