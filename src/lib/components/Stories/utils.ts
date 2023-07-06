import type { StoriesData, videoCtaUrls } from '$lib/types/IStories';

export const videoCtaList: Array<videoCtaUrls> = [
	{
		videoId: 1,
		ctaList: {
			genericUrl: '/explorefunds/sip-with-100?id=101'
		}
	},
	{
		videoId: 2,
		ctaList: {
			genericUrl: '/explorefunds/index-funds?id=103'
		}
	},
	{
		videoId: 3,
		ctaList: {
			B2C_D:
				'/schemes/sbi-large-and-midcap-fund-direct-plan-growth-isin-inf200k01uj5-schemecode-sbd017g-gr',
			B2C_P:
				'/schemes/sbi-large-and-midcap-fund-direct-plan-growth-isin-inf200k01uj5-schemecode-sbd017g-gr',
			B2B_D:
				'/schemes/sbi-large-and-midcap-fund-regular-plan-growth-isin-inf200k01305-schemecode-017g',
			B2B_P:
				'/schemes/sbi-large-and-midcap-fund-regular-plan-growth-isin-inf200k01305-schemecode-017g',
			genericUrl: ''
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
					videoUrl: 'https://cdn.angelone.in/mutualfunds/videos/video1c4.mp4'
				}
			],
			imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail1c1.webp',
			smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail1c2.webp',
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
					videoUrl: 'https://cdn.angelone.in/mutualfunds/videos/video2c4.mp4'
				}
			],
			imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail2c1.webp',
			smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail2c2.webp',
			ctaType: '',
			ctaText: 'START SIP NOW',
			ctaUrl: ''
		},
		{
			storyId: 3,
			title: 'Best of SBI',
			videos: [
				{
					videoId: 3,
					videoUrl: 'https://cdn.angelone.in/mutualfunds/videos/video3c4.mp4'
				}
			],
			imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail3c1.webp',
			smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail3c2.webp',
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
					videoUrl: 'https://cdn.angelone.in/mutualfunds/videos/video4c4.mp4'
				}
			],
			imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail4c1.webp',
			smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail4c2.webp',
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
						videoUrl: 'https://cdn.angelone.in/mutualfunds/videos/video1c4.mp4'
					}
				],
				imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail1c1.webp',
				smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail1c2.webp',
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
						videoUrl: 'https://cdn.angelone.in/mutualfunds/videos/video2c4.mp4'
					}
				],
				imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail2c1.webp',
				smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail2c2.webp',
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: getCtaUrlCallback(2)
			},
			{
				storyId: 3,
				title: 'Best of SBI',
				videos: [
					{
						videoId: 3,
						videoUrl: 'https://cdn.angelone.in/mutualfunds/videos/video3c4.mp4'
					}
				],
				imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail3c1.webp',
				smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail3c2.webp',
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: getCtaUrlCallback(3)
			},
			{
				storyId: 4,
				title: 'All Season Fund',
				videos: [
					{
						videoId: 4,
						videoUrl: 'https://cdn.angelone.in/mutualfunds/videos/video4c4.mp4'
					}
				],
				imageThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail4c1.webp',
				smallThumbnailUrl: 'https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail4c2.webp',
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: getCtaUrlCallback(4)
			}
		]
	};

	return storiesDataObject;
};
