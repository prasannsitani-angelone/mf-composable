<script lang="ts">
	import TrendingFunds from './TrendingFunds/TrendingFunds.svelte';
	import StartNewInvestment from './StartNewInvestment.svelte';
	import ExploreScheme from './ExploreScheme/ExploreScheme.svelte';
	import PortfolioCard from '$components/PortfolioCards/PortfolioCard.svelte';
	import { page } from '$app/stores';
	import IntersectionObserver from 'svelte-intersection-observer';
	import type {
		INudge,
		IRetryPaymentNudge,
		NudgeDataType,
		StartFirstSipNudgeType
	} from '$lib/types/INudge';
	import { format } from 'date-fns';
	import type { IDueSips, ISip } from '$lib/types/ISipType';
	import {
		homepageMultipleSipPaymentDueNudgeImpressionAnalytics,
		homepageSipPaymentDueNudgeImpressionAnalytics,
		nudgeClick,
		nudgeImpression,
		sHomepage
	} from '$lib/analytics/DiscoverFunds';
	import type { PageData } from './$types';
	import type { StoriesData, videoCtaUrls } from '$lib/types/IStories';
	import { userStore } from '$lib/stores/UserStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { appStore } from '$lib/stores/SparkStore';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';
	import StoriesComponent from '$components/Stories/StoriesComponent.svelte';
	import Button from '$components/Button.svelte';
	import { SEO } from 'wms-ui-component';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { onMount, tick } from 'svelte';
	import Analytics from '$lib/utils/analytics';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import LazyComponent from '$components/LazyComponent.svelte';

	$: isLoggedInUser = !data?.isGuest;
	$: deviceType = $page.data.deviceType;
	$: isGuest = $page.data.isGuest;
	let sipPaymentNudges: ISip[] = [];
	let retryPaymentNudges: IRetryPaymentNudge[] = [];
	let formattedSipNudgeData: ISip;
	let nudgesData: NudgeDataType;
	let formattedRetryPaymentNudgeData: IRetryPaymentNudge;
	let startFirstSipNudgeData: StartFirstSipNudgeType;
	let elementOnce: HTMLElement;
	let intersectOnce: boolean;
	const getNudgeData = async () => {
		let nudgesData: NudgeDataType = {
			nudges: []
		};

		if (!$page.data.isGuest) {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/nudges`;
			const res = await useFetch(url, {}, fetch);
			if (res.ok) {
				nudgesData = res?.data;
				return nudgesData;
			}
			return nudgesData;
		}
		return nudgesData;
	};
	const setSipNudgesData = (nudgeData: NudgeDataType) => {
		sipPaymentNudges = [];
		nudgeData?.nudges?.forEach((nudge: INudge) => {
			if (nudge?.nudgesType === 'SIP_INSTALLMENT') {
				const data = nudge?.data || {};
				sipPaymentNudges.push({ ...data });
			}
		});

		if (deviceType?.isMobile && sipPaymentNudges?.length) {
			formattedSipNudgeData = sipPaymentNudges?.[0];

			if (sipPaymentNudges?.length > 1) {
				let amountSum = 0;
				sipPaymentNudges?.forEach((sip) => {
					amountSum += sip?.installmentAmount;
				});
				formattedSipNudgeData.schemeName = `${sipPaymentNudges?.length} Pending SIP Payments`;
				formattedSipNudgeData.installmentAmount = amountSum;
			}
		}

		// sip payments due analytics
		if (sipPaymentNudges?.length) {
			if (sipPaymentNudges?.length > 1) {
				const dueSips: IDueSips[] = [];

				sipPaymentNudges?.forEach((sip) => {
					dueSips.push({
						SipCount: `${sipPaymentNudges?.length} Pending SIP Payments`,
						Amount: sip?.installmentAmount,
						SipPaymentDue: sip?.installmentAmount,
						SipDate: format(new Date(sip?.sipPaymentDate), 'dd-MMM-yyyy'),
						PayBefore: format(new Date(sip?.sipAmountPayTillDate), 'dd-MMM-yyyy')
					});
				});
				homepageMultipleSipPaymentDueNudgeImpressionAnalytics({ dueSips, version: 'A' });
			} else {
				const eventMetaData = {
					FundName: sipPaymentNudges?.[0]?.schemeName,
					Amount: sipPaymentNudges?.[0]?.installmentAmount,
					SipPaymentDue: sipPaymentNudges?.[0]?.installmentAmount,
					SipDate: format(new Date(sipPaymentNudges?.[0]?.sipPaymentDate), 'dd-MMM-yyyy'),
					PayBefore: format(new Date(sipPaymentNudges?.[0]?.sipAmountPayTillDate), 'dd-MMM-yyyy')
				};
				homepageSipPaymentDueNudgeImpressionAnalytics(eventMetaData);
			}
		}
		return '';
	};

	const setRetryPaymentNudgesData = (nudgeData: NudgeDataType) => {
		retryPaymentNudges = [];
		nudgeData?.nudges?.forEach((nudge: INudge) => {
			if (nudge?.nudgesType === 'PAYMENT_FAILED') {
				const data = nudge?.data || {};
				retryPaymentNudges.push({ ...data });
			}
		});

		if (retryPaymentNudges?.length) {
			formattedRetryPaymentNudgeData = retryPaymentNudges?.[0];
			formattedRetryPaymentNudgeData.orderDate = format(
				new Date(Number(formattedRetryPaymentNudgeData?.orderDate || 0) * 1000),
				'dd MMM yyyy'
			);

			if (retryPaymentNudges?.length > 1) {
				let amountSum = 0;
				retryPaymentNudges?.forEach((order) => {
					amountSum += order?.amount;
				});
				formattedRetryPaymentNudgeData.schemeName = 'Multiple payments failed';
				formattedRetryPaymentNudgeData.amount = amountSum;
			}
		}
		return '';
	};

	const setNudgeData = (nudgeData: NudgeDataType) => {
		nudgesData = nudgeData;
		return '';
	};

	const setStartFirstSipNudgeData = () => {
		(nudgesData?.nudges || [])?.forEach((item) => {
			if (item?.nudgesType === 'CREATE_YOUR_FIRST_SIP') {
				startFirstSipNudgeData = item;
			}
		});
	};

	const setStoryCtaUrl = (vidId: number) => {
		const selectedVid: videoCtaUrls | undefined = videoCtaList?.find(
			(vid) => vid?.videoId === vidId
		);

		if (selectedVid) {
			if (Object.keys(selectedVid?.ctaList)?.length > 1) {
				return (
					selectedVid?.ctaList[`${$userStore?.userType}_${profileStore?.accountType()}`] || '/'
				);
			} else if (Object.keys(selectedVid?.ctaList)?.length) {
				return selectedVid?.ctaList.genericUrl || '/';
			}
		}

		return '/';
	};

	const videoCtaList: Array<videoCtaUrls> = [
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

	let storiesData: StoriesData = {
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
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: setStoryCtaUrl(1)
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
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: setStoryCtaUrl(2)
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
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: setStoryCtaUrl(3)
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
				ctaType: '',
				ctaText: 'START SIP NOW',
				ctaUrl: setStoryCtaUrl(4)
			}
		]
	};

	onMount(async () => {
		await tick();
		sHomepage({
			version: 'A',
			userType: $page?.data?.userDetails?.userType || 'B2C',
			storyVisible: storiesData?.stories?.length > 0 ? 'Y' : 'N'
		});
		Analytics.flush();
		getNudgeData().then((nudgeData) => {
			setNudgeData(nudgeData);
			setSipNudgesData(nudgeData);
			setRetryPaymentNudgesData(nudgeData);
			setStartFirstSipNudgeData();
		});
	});

	export let data: PageData;
</script>

<SEO
	seoTitle="Find The Right Mutual Fund For Your Needs | Angel One"
	seoDescription="Set your Goals and find the right Mutual Funds to achieve your goal. Explore mutual funds by performance and start your investment journey with Angel One."
/>

<article>
	<!-- Stories section -->
	{#if storiesData?.stories?.length}
		<StoriesComponent stories={storiesData?.stories} version="A" />
	{/if}

	<!-- 2. <Portfolio Card / Start First SIP Nudge /> -->
	{#if isLoggedInUser && deviceType?.isMobile && nudgesData}
		{#if startFirstSipNudgeData}
			<LazyComponent
				when={isLoggedInUser && deviceType?.isMobile && startFirstSipNudgeData}
				component={async () => await import('$components/StartFirstSip/StartFirstSipNudge.svelte')}
				nudgeData={startFirstSipNudgeData}
				version="A"
			/>
		{:else}
			<div class="mb-2 block overflow-hidden sm:mb-0">
				<PortfolioCard discoverPage={true} investmentSummary={data.investementSummary} />
			</div>
		{/if}
	{/if}

	<LazyComponent
		sip={formattedSipNudgeData}
		sipCount={sipPaymentNudges?.length}
		when={deviceType?.isMobile && sipPaymentNudges?.length}
		component={async () =>
			await import('../(authenticated)/orders/orderspage/sipbook/SipCard.svelte')}
	/>

	<TrendingFunds tableData={data?.searchDashboardData?.weeklyTopSchemes} version="A" />

	<article class="max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-0">
		<ExploreScheme searchOptions={data?.searchDashboardData?.searchOptions} />
	</article>

	<!-- External Funds, NFO, Calculator -->

	<IntersectionObserver once element={elementOnce} bind:intersecting={intersectOnce}>
		<div bind:this={elementOnce}>
			<LazyComponent
				{isGuest}
				when={intersectOnce}
				component={async () =>
					await import('./ExternalFundsNfoCalculatorCard/ExternalFundsNfoCalculatorCard.svelte')}
			/>
		</div>
	</IntersectionObserver>
	<!-- Retry Payment Nudge -->
	{#if retryPaymentNudges?.length}
		<LazyComponent
			order={formattedRetryPaymentNudgeData}
			orderCount={retryPaymentNudges?.length}
			when={retryPaymentNudges?.length > 0}
			component={async () => await import('./FailedOrdersNudge.svelte')}
		/>
	{/if}
	{#if nudgesData?.nudges?.length}
		{#each nudgesData?.nudges as nudge, index (index)}
			<section>
				{#if nudge?.nudgesType !== 'mandate' && nudge?.nudgesType !== 'SIP_INSTALLMENT' && nudge?.nudgesType !== 'PAYMENT_FAILED' && nudge?.nudgesType !== 'CREATE_YOUR_FIRST_SIP'}
					<LazyComponent
						{nudge}
						clickEvent={nudgeClick}
						impressionEvent={nudgeImpression}
						class="mt-2 sm:mt-4"
						when={nudgesData?.nudges?.length > 0}
						component={async () => await import('$components/Nudge/DiscoverFundsNudge.svelte')}
					/>
				{/if}
			</section>
		{/each}
	{/if}
</article>

{#if deviceType?.isBrowser}
	<article>
		<div class="sticky -top-2">
			{#if isLoggedInUser}
				<div class="block overflow-hidden">
					<PortfolioCard discoverPage={true} investmentSummary={data.investementSummary} />
				</div>
			{:else}
				<StartNewInvestment searchOptions={data?.searchDashboardData?.searchOptions} />
			{/if}
			{#if sipPaymentNudges?.length}
				<section class="mt-2">
					{#each sipPaymentNudges as sip, index (sip?.sipId + index)}
						<LazyComponent
							{sip}
							when={sipPaymentNudges?.length}
							component={async () =>
								await import('../(authenticated)/orders/orderspage/sipbook/SipCard.svelte')}
						/>
					{/each}
				</section>
			{/if}
			{#if data?.searchDashboardData?.amcAd}
				<IntersectionObserver once element={elementOnce} bind:intersecting={intersectOnce}>
					<div bind:this={elementOnce}>
						<LazyComponent
							amcData={data.searchDashboardData.amcAd}
							class="mt-3 rounded-lg text-center"
							imageClass="h-32 md:h-42 lg:h-32 w-full object-cover"
							when={intersectOnce}
							component={async () => await import('$components/Promotions/PromotionCard.svelte')}
						/>
					</div>
				</IntersectionObserver>
			{/if}
		</div>
	</article>
{/if}

{#if data?.searchDashboardData?.amcAd && !deviceType?.isBrowser}
	<IntersectionObserver once element={elementOnce} bind:intersecting={intersectOnce}>
		<div bind:this={elementOnce}>
			<LazyComponent
				amcData={data.searchDashboardData.amcAd}
				class="mt-3 rounded-lg text-center"
				imageClass="h-32 md:h-42 lg:h-32 w-full object-cover"
				when={deviceType?.isBrowser && intersectOnce}
				component={async () => await import('$components/Promotions/PromotionCard.svelte')}
			/>
		</div>
	</IntersectionObserver>
{/if}

{#if !($appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID || $appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS) && deviceType?.isMobile && !isGuest}
	<article class="flex justify-center sm:hidden">
		<Button
			variant="transparent"
			class="mt-2 !w-min !bg-transparent !text-blue-primary"
			onClick={logoutAttemptStore.showLogoutConfirmationPopup}
		>
			LOGOUT
		</Button>
	</article>
{/if}
