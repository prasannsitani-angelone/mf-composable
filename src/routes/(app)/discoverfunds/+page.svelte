<script lang="ts">
	import TrendingFunds from '$components/TrendingFunds/TrendingFunds.svelte';
	import StartNewInvestment from './StartNewInvestment.svelte';
	import ExploreScheme from './ExploreScheme/ExploreScheme.svelte';
	import PortfolioCard from '$components/PortfolioCards/PortfolioCard.svelte';
	import { page } from '$app/stores';
	import IntersectionObserver from 'svelte-intersection-observer';
	import type {
		INudge,
		IRetryPaymentNudge,
		NudgeDataType,
		Start4SipsNudgeType,
		StartFirstSipNudgeType
	} from '$lib/types/INudge';
	import { format } from 'date-fns';
	import type { IDueSips, ISip } from '$lib/types/ISipType';
	import {
		homepageMultipleSipPaymentDueNudgeImpressionAnalytics,
		homepageSipPaymentDueNudgeImpressionAnalytics,
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
	import { SEO, WMSIcon } from 'svelte-components';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { onDestroy, onMount, tick } from 'svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import LazyComponent from '$components/LazyComponent.svelte';
	import {
		setStoriesData,
		storiesDataObjectWithoutUrls,
		videoCtaList
	} from '$components/Stories/utils';
	import { exitNudgeStore } from '$lib/stores/ExitNudgeStore';
	import { browser } from '$app/environment';
	import ExternalFundsNfoCalculatorCard from './ExternalFundsNfoCalculatorCard/ExternalFundsNfoCalculatorCard.svelte';
	import Clevertap from '$lib/utils/Clevertap';

	interface CtKv {
		topic: string;
		Name: string;
		Product: string;
	}
	let cleavertap;
	$: isLoggedInUser = !data?.isGuest;
	$: deviceType = $page.data.deviceType;
	$: isGuest = $page.data.isGuest;
	let sipPaymentNudges: ISip[] = [];
	let retryPaymentNudges: IRetryPaymentNudge[] = [];
	let formattedSipNudgeData: ISip;
	let nudgesData: NudgeDataType;
	let formattedRetryPaymentNudgeData: IRetryPaymentNudge;
	let startFirstSipNudgeData: StartFirstSipNudgeType;
	let start4SipsNudgeData: Start4SipsNudgeType;
	let elementOnce: HTMLElement;
	let intersectOnce: boolean;
	let ctKv: CtKv = {
		topic: '',
		Name: '',
		Product: ''
	};

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

	const setOtherNudgeDataTypes = () => {
		(nudgesData?.nudges || [])?.forEach((item) => {
			if (item?.nudgesType === 'CREATE_YOUR_FIRST_SIP') {
				startFirstSipNudgeData = item;
				exitNudgeStore.hasNudgeData(true);
			} else if (item?.nudgesType === 'START_FOUR_SIPS') {
				start4SipsNudgeData = item;
			}
		});
	};

	let storiesData: StoriesData = storiesDataObjectWithoutUrls;

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
	// let clevertap;
	onMount(async () => {
		await tick();

		storiesData = setStoriesData(setStoryCtaUrl);

		sHomepage({
			version: 'A',
			userType: $page?.data?.userDetails?.userType || 'B2C',
			storyVisible: storiesData?.stories?.length > 0 ? 'Y' : 'N'
		});
		getNudgeData().then((nudgeData) => {
			setNudgeData(nudgeData);
			setSipNudgesData(nudgeData);
			setRetryPaymentNudgesData(nudgeData);
			setOtherNudgeDataTypes();
		});
		document.addEventListener('CT_web_native_display', function (event) {
			// alert("CT Event ")
			const data = event.detail;
			ctKv = data.kv;
		});
		cleavertap = await Clevertap.initialized;

		if (
			data?.investementSummary?.investedValue < 5000 ||
			!data?.investementSummary?.investedValue
		) {
			cleavertap.event.push('Holdings_less_than_threshhold', {
				Name: 'Test',
				Category: 'Holdings',
				value: data?.investementSummary?.investedValue,
				Date: new Date()
			});
		}
	});

	onDestroy(() => {
		if (browser) {
			exitNudgeStore.setShown();
		}
	});

	export let data: PageData;

	let showExitNudge = false;
	exitNudgeStore.subscribe((store) => {
		showExitNudge = store.showExitNudge;
	});
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
	{#if isLoggedInUser && deviceType?.isMobile}
		{#if data?.investementSummary?.currentValue}
			<div class="mb-2 block overflow-hidden sm:mb-0">
				<PortfolioCard discoverPage={true} investmentSummary={data?.investementSummary} />
			</div>
		{/if}
	{/if}
	{#if ctKv.topic}
		<div class="flex rounded bg-purple-glow p-3">
			<WMSIcon class="h-9 w-9" name="import-external-funds" width={36} height={36} />
			<p class="text-sm">
				View your entire mutual fund portfolio in one place <span class="font-bold">Name:</span>
				{ctKv.Name}, <span class="font-bold">Topic :</span>
				{ctKv.topic}, <span class="font-bold">Product:</span>
				{ctKv.Product}
			</p>
			<Button variant="transparent">Track Now</Button>
		</div>
	{/if}
	<LazyComponent
		sip={formattedSipNudgeData}
		sipCount={sipPaymentNudges?.length}
		when={deviceType?.isMobile && sipPaymentNudges?.length}
		component={async () => await import('../(authenticated)/sipbook/dashboard/SipCard.svelte')}
	/>

	<TrendingFunds tableData={data?.searchDashboardData?.weeklyTopSchemes} version="A" />

	<article class="max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-0">
		<ExploreScheme searchOptions={data?.searchDashboardData?.searchOptions} />
	</article>

	<!-- Retry Payment Nudge -->
	{#if retryPaymentNudges?.length}
		<LazyComponent
			order={formattedRetryPaymentNudgeData}
			orderCount={retryPaymentNudges?.length}
			when={retryPaymentNudges?.length > 0}
			component={async () => await import('./FailedOrdersNudge.svelte')}
		/>
	{/if}

	<LazyComponent
		when={isLoggedInUser && deviceType?.isMobile && start4SipsNudgeData}
		nudgeData={start4SipsNudgeData}
		class="mt-2"
		component={async () =>
			await import('$components/InvestWithExperts/CuratedInvestmentCardComponent.svelte')}
	/>

	<!-- External Funds, NFO, Calculator -->

	<!-- <IntersectionObserver once element={elementOnce} bind:intersecting={intersectOnce}>
		<div bind:this={elementOnce}>
			<LazyComponent
				{isGuest}
				when={intersectOnce}
				component={async () =>
					await import('./ExternalFundsNfoCalculatorCard/ExternalFundsNfoCalculatorCard.svelte')}
			/>
		</div>
	</IntersectionObserver> -->
	<ExternalFundsNfoCalculatorCard {isGuest} />
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
								await import('../(authenticated)/sipbook/dashboard/SipCard.svelte')}
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
				when={intersectOnce}
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

<LazyComponent
	nudgeData={startFirstSipNudgeData}
	when={showExitNudge}
	component={async () => await import('$components/ExitNudge/ExitNudgeComponent.svelte')}
/>
