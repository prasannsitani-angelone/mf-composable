<script lang="ts">
	import TrendingFunds from '$components/TrendingFunds/TrendingFunds.svelte';
	import StartNewInvestment from './StartNewInvestment.svelte';
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
	import { SEO } from 'svelte-components';
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
	import QuickEntryPointsComponent from './QuickEntryPoints/QuickEntryPointsComponent.svelte';
	import CategoriesComponent from './CategoriesComponent.svelte';
	import { askAngelEntryImpressionAnalytics } from '$lib/analytics/askangel/askangel';
	import { ctNudgeStore } from '$lib/stores/CtNudgeStore';
	import { goto } from '$app/navigation';
	import ClevertapNudgeComponent from '$components/clevertap/ClevertapNudgeComponent.svelte';
	import Clevertap from '$lib/utils/Clevertap';

	$: isLoggedInUser = !data?.isGuest;
	$: deviceType = $page.data.deviceType;
	$: isGuest = $page.data.isGuest;
	let sipPaymentNudges: ISip[] = [];
	let sipPaymentMonthNudges: IRetryPaymentNudge[] = [];
	let retryPaymentNudges: IRetryPaymentNudge[] = [];
	let formattedSipNudgeData: ISip;
	let nudgesData: NudgeDataType;
	let formattedRetryPaymentNudgeData: IRetryPaymentNudge;
	let formattedSipPaymentMonthNudgeData: IRetryPaymentNudge;
	let startFirstSipNudgeData: StartFirstSipNudgeType;
	let start4SipsNudgeData: Start4SipsNudgeType;
	let elementOnce: HTMLElement;
	let intersectOnce: boolean;
	let showExitNudge = false;

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

	const setSipPaymentMonthNudgeData = (nudgeData: NudgeDataType) => {
		sipPaymentMonthNudges = [];
		nudgeData?.nudges?.forEach((nudge: INudge) => {
			if (nudge?.nudgesType === 'SIP_TWENTY_DAY_NUDGE') {
				const data = nudge?.data || {};
				sipPaymentMonthNudges.push({ ...data });
			}
		});

		if (sipPaymentMonthNudges?.length) {
			formattedSipPaymentMonthNudgeData = sipPaymentMonthNudges?.[0];

			if (sipPaymentMonthNudges?.length > 1) {
				let amountSum = 0;
				sipPaymentMonthNudges?.forEach((order) => {
					amountSum += order?.amount;
				});
				formattedSipPaymentMonthNudgeData.schemeName = `${
					sipPaymentMonthNudges?.length || 0
				} Pending SIP Payments`;
				formattedSipPaymentMonthNudgeData.amount = amountSum;
			}
		}
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
			setSipPaymentMonthNudgeData(nudgeData);
			setRetryPaymentNudgesData(nudgeData);
			setOtherNudgeDataTypes();
		});

		exitNudgeStore.subscribe((store) => {
			showExitNudge = store.showExitNudge;
		});

		if (data?.layoutConfig?.showAskAngelEntry) {
			askAngelEntryImpressionAnalytics();
		}

		await initializeClevertapData();
	});

	const initializeClevertapData = async () => {
		const cleavertap = await Clevertap.initialized;
		cleavertap.event.push('MF Discover', {
			event_type: 'impression'
		});
	};

	onDestroy(() => {
		if (browser) {
			exitNudgeStore.setShown();
		}
	});

	export let data: PageData;

	let placementMapping = {};

	const setPlacement = () => {
		placementMapping = {};

		if ($page.data.deviceType?.isMobile || $page.data.deviceType?.isTablet) {
			placementMapping = {
				stories: { rowStart: 1, columnStart: 1 },
				investments: { rowStart: 2, columnStart: 1 },
				startFirstSip: { rowStart: 3, columnStart: 1 },
				ctNudge: { rowStart: 4, columnStart: 1 },
				trendingFunds: { rowStart: 5, columnStart: 1 },
				categories: { rowStart: 6, columnStart: 1 },
				sipNudges: { rowStart: 3, columnStart: 1 },
				failedOrdersNudge: { rowStart: 7, columnStart: 1 },
				sipPaymentMonthNudge: { rowStart: 8, columnStart: 1 },
				curatedInvestmentCard: { rowStart: 9, columnStart: 1 },
				quickEntryPoints: { rowStart: 10, columnStart: 1 },
				promotionCard: { rowStart: 12, columnStart: 1 },
				logout: { rowStart: 12, columnStart: 1 }
			};
		} else {
			placementMapping = {
				stories: { rowStart: 1, columnStart: 1 },
				trendingFunds: { rowStart: 2, columnStart: 1 },
				categories: { rowStart: 3, columnStart: 1 },
				failedOrdersNudge: { rowStart: 4, columnStart: 1 },
				sipPaymentMonthNudge: { rowStart: 5, columnStart: 1 },
				curatedInvestmentCard: { rowStart: 6, columnStart: 1 },
				quickEntryPoints: { rowStart: 7, columnStart: 1 },
				investments: { rowStart: 1, columnStart: 2 },
				sipNudges: { rowStart: 2, columnStart: 2 },
				promotionCard: { rowStart: 3, columnStart: 2 },
				ctNudge: { rowStart: 4, columnStart: 2 }
			};
		}
	};

	setPlacement();
</script>

<SEO
	seoTitle="Find The Right Mutual Fund For Your Needs | Angel One"
	seoDescription="Set your Goals and find the right Mutual Funds to achieve your goal. Explore mutual funds by performance and start your investment journey with Angel One."
/>

<article class="grid grid-cols-[100%]">
	<!-- 1. Stories section -->
	{#if storiesData?.stories?.length}
		<StoriesComponent
			class="row-start-{placementMapping?.stories?.rowStart} col-start-{placementMapping?.stories
				?.columnStart} !mb-0 {placementMapping?.stories?.rowStart > 1 ? 'mt-2' : ''}"
			stories={storiesData?.stories}
			version="A"
		/>
	{/if}

	<!-- 2. <Portfolio Card / Start First SIP Nudge /> -->
	{#if isLoggedInUser && deviceType?.isMobile}
		{#if data?.investementSummary?.currentValue}
			<div
				class="row-start-{placementMapping?.investments?.rowStart} col-start-{placementMapping
					?.investments?.columnStart} mb-0 block overflow-hidden {placementMapping?.investments
					?.rowStart > 1
					? 'mt-2'
					: ''}"
			>
				<PortfolioCard discoverPage={true} investmentSummary={data?.investementSummary} />
			</div>
		{/if}
	{/if}

	{#if $ctNudgeStore?.kv?.topic === 'mf_discover_inpage1_type_d'}
		{#if !deviceType?.isBrowser}
			<ClevertapNudgeComponent
				class="row-start-{placementMapping?.ctNudge?.rowStart} col-start-{placementMapping?.ctNudge
					?.columnStart} {placementMapping?.ctNudge?.rowStart > 1 ? '!mt-2' : ''} rounded-lg"
				data={$ctNudgeStore}
				on:onCTAClicked={(e) => goto(e.detail.url)}
			/>
		{/if}
	{/if}

	<!-- 3. Most Bought Section -->
	<TrendingFunds
		class="row-start-{placementMapping?.trendingFunds?.rowStart} col-start-{placementMapping
			?.trendingFunds?.columnStart} !my-0 {placementMapping?.trendingFunds?.rowStart > 1
			? '!mt-2'
			: ''}"
		tableData={data?.searchDashboardData?.weeklyTopSchemes}
		version="A"
	/>

	<!-- 4. Category Section -->
	<article
		class="row-start-{placementMapping?.categories?.rowStart} col-start-{placementMapping
			?.categories?.columnStart} {placementMapping?.categories?.rowStart > 1 ? '!mt-2' : ''}"
	>
		<CategoriesComponent categories={data?.searchDashboardData?.categories} />
	</article>

	<!-- 6. Sip Nudges -->
	<LazyComponent
		sip={formattedSipNudgeData}
		sipCount={sipPaymentNudges?.length}
		class="row-start-{placementMapping?.sipNudges?.rowStart} col-start-{placementMapping?.sipNudges
			?.columnStart} !mb-0 sm:hidden {placementMapping?.sipNudges?.rowStart > 1 ? '!mt-2' : ''}"
		when={deviceType?.isMobile && sipPaymentNudges?.length}
		component={async () => await import('../(authenticated)/sipbook/dashboard/SipCard.svelte')}
	/>

	<!-- 7. Other Nudges - Retry Payment Nudge & Others -->
	{#if retryPaymentNudges?.length}
		<div
			class="row-start-{placementMapping?.failedOrdersNudge?.rowStart} col-start-{placementMapping
				?.failedOrdersNudge?.columnStart} {placementMapping?.failedOrdersNudge?.rowStart > 1
				? '!my-0'
				: '!-my-2'}"
		>
			<LazyComponent
				order={formattedRetryPaymentNudgeData}
				orderCount={retryPaymentNudges?.length}
				when={retryPaymentNudges?.length > 0}
				component={async () => await import('./FailedOrdersNudge.svelte')}
			/>
		</div>
	{/if}

	<!-- SIP payment all month nudge -->
	{#if sipPaymentMonthNudges?.length}
		<div
			class="row-start-{placementMapping?.sipPaymentMonthNudge
				?.rowStart} col-start-{placementMapping?.sipPaymentMonthNudge
				?.columnStart} {placementMapping?.sipPaymentMonthNudge?.rowStart > 1 ? '!my-0' : '!-my-2'}"
		>
			<LazyComponent
				sip={formattedSipPaymentMonthNudgeData}
				sipCount={sipPaymentMonthNudges?.length}
				when={sipPaymentMonthNudges?.length > 0}
				component={async () => await import('./SipPaymentMonthNudge.svelte')}
			/>
		</div>
	{/if}

	<!-- 8. Start 4 SIPs (curated) Section -->
	<div
		class="row-start-{placementMapping?.curatedInvestmentCard?.rowStart} col-start-{placementMapping
			?.curatedInvestmentCard?.columnStart} {placementMapping?.curatedInvestmentCard?.rowStart > 1
			? '!my-0'
			: '!-my-2'}"
	>
		<LazyComponent
			class="!mt-2"
			when={isLoggedInUser && deviceType?.isMobile && start4SipsNudgeData}
			nudgeData={start4SipsNudgeData}
			component={async () =>
				await import('$components/InvestWithExperts/CuratedInvestmentCardComponent.svelte')}
		/>
	</div>

	<!-- 9. Quick Entry Points - External Funds, NFO, Calculator -->
	<QuickEntryPointsComponent
		class="row-start-{placementMapping?.quickEntryPoints?.rowStart} col-start-{placementMapping
			?.quickEntryPoints?.columnStart} {placementMapping?.quickEntryPoints?.rowStart > 1
			? 'mt-2'
			: ''}"
		{isGuest}
	/>

	<!-- 10. PromotionCard -->
	{#if data?.searchDashboardData?.amcAd && !deviceType?.isBrowser}
		<div
			class="row-start-{placementMapping?.promotionCard?.rowStart} col-start-{placementMapping
				?.promotionCard?.columnStart} sm:hidden {placementMapping?.promotionCard?.rowStart > 1
				? 'mt-2'
				: ''}"
		>
			<IntersectionObserver once element={elementOnce} bind:intersecting={intersectOnce}>
				<div bind:this={elementOnce}>
					<LazyComponent
						amcData={data.searchDashboardData.amcAd}
						class="rounded-lg text-center"
						imageClass="h-32 md:h-42 lg:h-32 w-full object-cover"
						when={intersectOnce}
						component={async () => await import('$components/Promotions/PromotionCard.svelte')}
					/>
				</div>
			</IntersectionObserver>
		</div>
	{/if}

	<!-- 11. Logout -->
	{#if !($appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID || $appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS) && deviceType?.isMobile && !isGuest}
		<article
			class="row-start-{placementMapping?.logout?.rowStart} col-start-{placementMapping?.logout
				?.columnStart} flex justify-center sm:hidden"
		>
			<Button
				variant="transparent"
				class="mt-2 !w-min !bg-transparent !text-blue-primary"
				onClick={logoutAttemptStore.showLogoutConfirmationPopup}
			>
				LOGOUT
			</Button>
		</article>
	{/if}

	<!-- 12. Start First SIP -->
	<LazyComponent
		class="row-start-{placementMapping?.startFirstSip?.rowStart} col-start-{placementMapping
			?.startFirstSip?.columnStart} {placementMapping?.startFirstSip?.rowStart > 1 ? 'mt-2' : ''}"
		when={isLoggedInUser && deviceType?.isMobile && nudgesData && startFirstSipNudgeData}
		component={async () => await import('$components/StartFirstSip/StartFirstSipNudge.svelte')}
		nudgeData={startFirstSipNudgeData}
		version="A"
	/>
</article>

{#if deviceType?.isBrowser}
	<article class="sticky -top-2 hidden grid-cols-[100%] sm:grid" style="height:min-content">
		<div class="row-start-{placementMapping?.investments?.rowStart}">
			{#if isLoggedInUser}
				<div class="block overflow-hidden">
					<PortfolioCard discoverPage={true} investmentSummary={data.investementSummary} />
				</div>
			{:else}
				<StartNewInvestment />
			{/if}
			{#if $ctNudgeStore?.kv?.topic === 'mf_discover_inpage1_type_d'}
				<ClevertapNudgeComponent
					class="row-start-{placementMapping?.ctNudge?.rowStart} mt-2 w-full rounded-lg"
					data={$ctNudgeStore}
					on:onCTAClicked={(e) => goto(e.detail.url)}
				/>
			{/if}

			{#if sipPaymentNudges?.length}
				<section class="row-start-{placementMapping?.sipNudges?.rowStart} mt-2">
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
							class="row-start-{placementMapping?.promotionCard
								?.rowStart} mt-3 rounded-lg text-center"
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

<LazyComponent
	nudgeData={startFirstSipNudgeData}
	when={showExitNudge}
	component={async () => await import('$components/ExitNudge/ExitNudgeComponent.svelte')}
/>
