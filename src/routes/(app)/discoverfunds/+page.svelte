<script lang="ts">
	import TrendingFunds from './TrendingFunds/TrendingFunds.svelte';
	import StartNewInvestment from './StartNewInvestment.svelte';
	import ExploreScheme from './ExploreScheme/ExploreScheme.svelte';
	import PortfolioCard from '$components/PortfolioCards/PortfolioCard.svelte';
	import type { InvestmentSummary } from '$lib/types/IInvestments';
	import { page } from '$app/stores';
	import SipCard from '../(authenticated)/orders/orderspage/sipbook/SipCard.svelte';
	import type { INudge, IRetryPaymentNudge, NudgeDataType } from '$lib/types/INudge';
	import { format } from 'date-fns';
	import type { IDueSips, ISip } from '$lib/types/ISipType';
	import FailedOrdersNudge from './FailedOrdersNudge.svelte';
	import DiscoverFundsNudge from '$components/Nudge/DiscoverFundsNudge.svelte';
	import {
		homepageMultipleSipPaymentDueNudgeImpressionAnalytics,
		homepageSipPaymentDueNudgeImpressionAnalytics,
		nudgeClick,
		nudgeImpression,
		homepageSipCalculatorClickAnalytics,
		sHomepage
	} from '$lib/analytics/DiscoverFunds';
	import type { PageData } from './$types';
	import type { StoriesData, videoCtaUrls } from '$lib/types/IStories';
	import { userStore } from '$lib/stores/UserStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { appStore } from '$lib/stores/SparkStore';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';
	import StoriesComponent from '$components/Stories/StoriesComponent.svelte';
	import Link from '$components/Link.svelte';
	import Button from '$components/Button.svelte';
	import PromotionCard from '$components/Promotions/PromotionCard.svelte';
	import { SEO, WMSIcon } from 'wms-ui-component';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { onMount, tick } from 'svelte';
	import Analytics from '$lib/utils/analytics';

	$: showPortfoliocard = !data?.isGuest;
	$: deviceType = $page.data.deviceType;
	$: isGuest = $page.data.isGuest;
	let sipPaymentNudges: ISip[] = [];
	let retryPaymentNudges: IRetryPaymentNudge[] = [];
	let formattedSipNudgeData: ISip;
	let nudgesData: NudgeDataType;

	let formattedRetryPaymentNudgeData: IRetryPaymentNudge;

	const onPortfolioDataReceived = (
		event: CustomEvent<{ investmentSummary: InvestmentSummary }>
	) => {
		const { currentValue } = event.detail.investmentSummary;
		if (!currentValue) {
			showPortfoliocard = false;
		}
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
				homepageMultipleSipPaymentDueNudgeImpressionAnalytics({ dueSips });
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
		sHomepage();
		Analytics.flush();
	});

	export let data: PageData;
</script>

<svelte:head>
	<link rel="preconnect" href="https://cdn.angelone.in" />
</svelte:head>
<SEO
	seoTitle="Find The Right Mutual Fund For Your Needs | Angel One"
	seoDescription="Set your Goals and find the right Mutual Funds to achieve your goal. Explore mutual funds by performance and start your investment journey with Angel One."
/>
{#await data?.getNudgeData}
	<span />
{:then nudgeData}
	{(() => setNudgeData(nudgeData))()}
	{(() => setSipNudgesData(nudgeData))()}
	{(() => setRetryPaymentNudgesData(nudgeData))()}
{/await}
<article>
	<!-- <InvestmentsStories /> -->

	<!-- Stories section -->
	{#if storiesData?.stories?.length}
		<StoriesComponent stories={storiesData?.stories} />
	{/if}

	{#if showPortfoliocard && deviceType?.isMobile}
		<Link to="/investments" class="mb-2 block overflow-hidden sm:mb-0">
			<PortfolioCard discoverPage={true} on:portfolidataReceived={onPortfolioDataReceived} />
		</Link>
	{/if}
	{#if deviceType?.isMobile && sipPaymentNudges?.length}
		<SipCard sip={formattedSipNudgeData} sipCount={sipPaymentNudges?.length} />
	{/if}

	<TrendingFunds tableData={data?.searchDashboardData?.weeklyTopSchemes} />

	<article class="max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-0">
		<ExploreScheme searchOptions={data?.searchDashboardData?.searchOptions} />
	</article>

	<!-- External Funds, NFO, Calculator -->
	<article class="mt-2 flex justify-around rounded bg-white px-4 py-6 pb-3 shadow-csm">
		<Link preloadData={isGuest ? 'off' : 'hover'} to="/investments?type=all">
			<!-- <div class="mb-2 flex flex-col items-center relative">
				<div class="h-9 w-9 rounded-full bg-[#F9BA4D]/[0.24] p-[6px]">
					<WMSIcon name="import-external-funds"/>
				</div>
				<div class="text-title-black mt-1 text-base font-medium">External Funds</div>
			</div> -->
			<div class="mb-2 flex flex-col items-center">
				<div
					class="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F9BA4D]/[0.24]"
				>
					<WMSIcon name="import-external-funds" />
				</div>
				<div class="text-title-black mt-2 text-sm font-medium lg:text-base">External Funds</div>
			</div>
		</Link>
		<Link to="/nfo">
			<div class="mb-2 flex flex-col items-center">
				<div class="relative h-9 w-9 items-center justify-center rounded-full bg-[#E1D1FC] p-[6px]">
					{#await data.streamed.nfo then nfo}
						<div
							class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-primary text-center text-xs text-white"
						>
							{nfo.length}
						</div>
					{/await}
					<WMSIcon name="announcement" />
				</div>
				<div class="text-title-black mt-2 text-sm font-medium lg:text-base">NFO</div>
			</div>
		</Link>
		<Link to="/sipCalculator" on:linkClicked={homepageSipCalculatorClickAnalytics}>
			<div class="mb-2 flex flex-col items-center">
				<div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9F3E1] p-[6px]">
					<WMSIcon name="fund-calculator" />
				</div>
				<div class="text-title-black mt-2 text-sm font-medium lg:text-base">SIP Calculator</div>
			</div>
		</Link>
	</article>

	<!-- Retry Payment Nudge -->
	{#if retryPaymentNudges?.length}
		<FailedOrdersNudge
			order={formattedRetryPaymentNudgeData}
			orderCount={retryPaymentNudges?.length}
		/>
	{/if}
	{#if nudgesData?.nudges?.length}
		{#each nudgesData?.nudges as nudge, index (index)}
			<section>
				{#if nudge?.nudgesType !== 'mandate' && nudge?.nudgesType !== 'SIP_INSTALLMENT' && nudge?.nudgesType !== 'PAYMENT_FAILED'}
					<DiscoverFundsNudge
						{nudge}
						clickEvent={nudgeClick}
						impressionEvent={nudgeImpression}
						class="mt-2 sm:mt-4"
					/>
				{/if}
			</section>
		{/each}
	{/if}
</article>

{#if deviceType?.isBrowser}
	<article>
		<div class="sticky -top-2">
			{#if showPortfoliocard}
				<Link to="/investments" class="block overflow-hidden">
					<PortfolioCard discoverPage={true} on:portfolidataReceived={onPortfolioDataReceived} />
				</Link>
			{:else}
				<StartNewInvestment searchOptions={data?.searchDashboardData?.searchOptions} />
			{/if}
			{#if sipPaymentNudges?.length}
				<section class="mt-2">
					{#each sipPaymentNudges as sip, index (sip?.sipId + index)}
						<SipCard {sip} />
					{/each}
				</section>
			{/if}
			{#if data?.searchDashboardData?.amcAd}
				<PromotionCard
					amcData={data.searchDashboardData.amcAd}
					class="mt-3 rounded-lg text-center"
					imageClass="h-32 md:h-42 lg:h-32 w-full object-cover"
				/>
			{/if}
		</div>
	</article>
{/if}

{#if data?.searchDashboardData?.amcAd && !deviceType?.isBrowser}
	<PromotionCard
		amcData={data.searchDashboardData.amcAd}
		class="mt-3 rounded-lg text-center"
		imageClass="h-32 md:h-42 lg:h-32 w-full object-cover"
	/>
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
