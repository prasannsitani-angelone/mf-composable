<script lang="ts">
	import OldTrendingFunds from '$components/TrendingFunds/Old/OldTrendingFunds.svelte';
	import PortfolioCard from '$components/PortfolioCards/PortfolioCard.svelte';
	import { page } from '$app/stores';
	import IntersectionObserver from 'svelte-intersection-observer';
	import type {
		INudge,
		IRetryPaymentNudge,
		NudgeDataType,
		Start4SipsNudgeType,
		StartFirstSipNudgeType,
		UserEducationNudgeType
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
	import QuickEntryPointsComponent from './QuickEntryPoints/QuickEntryPointsComponent.svelte';
	import CategoriesComponent from './CategoriesComponent.svelte';
	import { askAngelEntryImpressionAnalytics } from '$lib/analytics/askangel/askangel';
	import { ctNudgeStore } from '$lib/stores/CtNudgeStore';
	import ClevertapNudgeComponent from '$components/clevertap/ClevertapNudgeComponent.svelte';
	import Clevertap from '$lib/utils/Clevertap';
	import { schemeScreenerStore } from '$lib/stores/SchemeScreenerStore';
	import Screener from '$lib/components/Screener/ScreenerHome.svelte';
	import TutorialNudge from '$components/Tutorial/nudge/TutorialNudge.svelte';
	import type { INotificationSummary } from '$lib/types/INotifications';
	import { base } from '$app/paths';
	import BuyPortfolio from './BuyPortfolio.svelte';
	import SetupAutopayNudge from './SetupAutopayNudge.svelte';
	import AskAngel from './AskAngel.svelte';
	import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
	import {
		actionCentreEntryImpression,
		actionCentreClick
	} from '$lib/analytics/pendingActionCenter/analytics';
	import { cohorts, cohorts_LF } from '$lib/constants/cohorts';
	import SearchComponent from '$components/Search/SearchComponent.svelte';
	import Link from '$components/Link.svelte';
	import { modifiedGoto } from '$lib/utils/goto';
	import { slide } from 'svelte/transition';

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
	let userEducationNudge: UserEducationNudgeType;
	let autopayNudge: INudge;
	let elementOnce: HTMLElement;
	let intersectOnce: boolean;
	let showExitNudge = false;
	let notifData: INotificationSummary;
	let user_cohort = 'Fallback';
	let placementMapping = {};
	if ($page.data.deviceType?.isMobile || $page.data.deviceType?.isTablet) {
		placementMapping = cohorts[user_cohort].placementMapping;
	} else {
		placementMapping = cohorts_LF[user_cohort].placementMapping;
	}

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
	const getAllNotificationsData = async () => {
		notifData = {
			summary: [],
			totalCount: 0
		};

		if (!$page.data.isGuest) {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/notifications?summary=true`;
			const res = await useFetch(url, {}, fetch);
			if (res.ok) {
				notifData = res?.data?.data;
				return notifData;
			}
			return notifData;
		}
		return notifData;
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
			} else if (item?.nudgesType === 'USER_EDUCATION_ENGAGEMENT') {
				userEducationNudge = item;
			} else if (item?.nudgesType === 'mandate') {
				autopayNudge = item;
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

	const resetSelectedLinkedFamilyMembers = () => {
		appStore?.updateStore({ linkedmembers: { selected: [] } });
	};

	onMount(async () => {
		await tick();

		storiesData = setStoriesData(setStoryCtaUrl);

		resetSelectedLinkedFamilyMembers();

		getNudgeData().then((nudgeData) => {
			setNudgeData(nudgeData);
			setSipNudgesData(nudgeData);
			setSipPaymentMonthNudgeData(nudgeData);
			setRetryPaymentNudgesData(nudgeData);
			setOtherNudgeDataTypes();
		});
		getAllNotificationsData().then((data) => {
			notifData = data;
		});
		exitNudgeStore.subscribe((store) => {
			showExitNudge = store.showExitNudge;
		});

		if (data?.layoutConfig?.showAskAngelEntry) {
			askAngelEntryImpressionAnalytics();
		}
		schemeScreenerStore?.reinitializeStore();
		schemeScreenerStore.getFiltersResponse();
		sHomepage({
			version: 'A',
			userType: $page?.data?.userDetails?.userType || 'B2C',
			storyVisible: storiesData?.stories?.length > 0 ? 'Y' : 'N',
			mf_cohort_name: user_cohort
		});
		await initializeClevertapData();
		actionCentreEntryImpression();
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

	<!-- 2. Search section -->
	{#if $appStore.isTabView}
		<Link
			to={`/search`}
			ariaLabel="search"
			class="row-start-{placementMapping?.search?.rowStart} col-start-{placementMapping?.search
				?.columnStart}"
		>
			<SearchComponent class="mt-2 rounded-3xl bg-white" searchInputClass="!border-0">
				<div slot="defaultResult" />
			</SearchComponent>
		</Link>
	{/if}

	{#if notifData?.totalCount > 0 && placementMapping?.actions}
		{@const notifText =
			notifData?.summary?.length > 1
				? `${notifData?.totalCount} items require your attention`
				: notifData?.summary[0].type === 'instalment_failed_sips'
				? `${notifData?.summary[0].count} SIP payment${
						notifData?.summary[0].count === 1 ? '' : 's'
				  } missed`
				: notifData?.summary[0].type === 'payment_failed_orders'
				? `${notifData?.summary[0].count} failed order${
						notifData?.summary[0].count === 1 ? '' : 's'
				  } recently`
				: `${notifData?.summary[0].count} SIP payment${
						notifData?.summary[0].count === 1 ? ' is' : 's are'
				  } due`}
		<div
			class="row-start-{placementMapping?.actions?.rowStart} col-start-{placementMapping?.actions
				?.columnStart} slide-down mx-1 mt-2 rounded-md bg-yellow-background p-2 shadow-lg"
			in:slide={{ duration: 300 }}
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<WMSIcon name="exclamation-circle-solid" height={31} width={31} />
					<div class="pl-2 pr-4 text-black-key">
						<p class="text-sm font-medium">Action Required</p>
						<p class="pt-1 text-xs">
							{notifText}
						</p>
					</div>
				</div>
				<div>
					<Button
						size="sm"
						onClick={() => {
							modifiedGoto(`${base}/pendingActions`);
							actionCentreClick({ text: notifText });
						}}>ACT NOW</Button
					>
				</div>
			</div>
		</div>
	{/if}

	{#if userEducationNudge && deviceType?.isMobile && placementMapping?.tutorials}
		<TutorialNudge
			title={userEducationNudge.heading}
			subTitle={userEducationNudge.description}
			class="h-fit row-start-{placementMapping?.tutorials?.rowStart} col-start-{placementMapping
				?.tutorials?.columnStart} !mb-0 {placementMapping?.tutorials?.rowStart > 1 ? 'mt-2' : ''}"
		/>
	{/if}

	<!-- 2. Portfolio Card -->
	{#if isLoggedInUser && deviceType?.isMobile && placementMapping?.investments}
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
				on:onCTAClicked={(e) => modifiedGoto(e.detail.url)}
			/>
		{/if}
	{/if}

	<!-- 3. Most Bought Section -->
	<OldTrendingFunds
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
			?.categories?.columnStart} mt-2"
	>
		<CategoriesComponent categories={data?.searchDashboardData?.categories} />
	</article>

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

	{#if !deviceType?.isBrowser && autopayNudge && placementMapping?.setupAutopay}
		<SetupAutopayNudge
			class="row-start-{placementMapping?.setupAutopay?.rowStart} col-start-{placementMapping
				?.setupAutopay?.columnStart} {placementMapping?.setupAutopay?.rowStart > 1 ? 'mt-2' : ''}"
		/>
	{/if}

	{#if !deviceType?.isBrowser && placementMapping?.buyPortfolioCard}
		<BuyPortfolio
			class="row-start-{placementMapping?.buyPortfolioCard?.rowStart} col-start-{placementMapping
				?.buyPortfolioCard?.columnStart} {placementMapping?.buyPortfolioCard?.rowStart > 1
				? 'mt-2'
				: ''}"
		/>
	{/if}

	{#if !deviceType?.isBrowser && data?.layoutConfig?.showAskAngelEntry && $tokenStore.state === AUTH_STATE_ENUM.LOGGED_IN && placementMapping?.askAngel}
		<AskAngel
			class="row-start-{placementMapping?.askAngel?.rowStart} col-start-{placementMapping?.askAngel
				?.columnStart} {placementMapping?.askAngel?.rowStart > 1 ? 'mt-2' : ''}"
		/>
	{/if}

	<!-- 9. Quick Entry Points - External Funds, NFO, Calculator -->
	<QuickEntryPointsComponent
		class="row-start-{placementMapping?.quickEntryPoints?.rowStart} col-start-{placementMapping
			?.quickEntryPoints?.columnStart} {placementMapping?.quickEntryPoints?.rowStart > 1
			? 'mt-2'
			: ''}"
		{isGuest}
	/>
	<!-- 10. PromotionCard -->
	{#if data?.searchDashboardData?.amcAd && !deviceType?.isBrowser && placementMapping?.promotionCard}
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

	<Screener
		class="row-start-{placementMapping?.screener?.rowStart} col-start-{placementMapping?.screener
			?.columnStart}"
	/>

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
		when={isLoggedInUser && placementMapping?.startFirstSip && nudgesData && startFirstSipNudgeData}
		component={async () => await import('$components/StartFirstSip/StartFirstSipNudge.svelte')}
		nudgeData={startFirstSipNudgeData}
		version="A"
	/>
</article>

{#if deviceType?.isBrowser}
	<article class="sticky -top-2 hidden grid-cols-[100%] sm:grid" style="height:min-content">
		<div class="row-start-{placementMapping?.investments?.rowStart}">
			{#if isLoggedInUser && data.investementSummary?.currentValue && placementMapping?.investments}
				<div class="block overflow-hidden">
					<PortfolioCard discoverPage={true} investmentSummary={data.investementSummary} />
				</div>
			{/if}
			{#if $ctNudgeStore?.kv?.topic === 'mf_discover_inpage1_type_d'}
				<ClevertapNudgeComponent
					class="row-start-{placementMapping?.ctNudge?.rowStart} mt-2 w-full rounded-lg"
					data={$ctNudgeStore}
					on:onCTAClicked={(e) => modifiedGoto(e.detail.url)}
				/>
			{/if}
			{#if data?.searchDashboardData?.amcAd && placementMapping?.promotionCard}
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
			{#if autopayNudge && placementMapping?.setupAutopay}
				<SetupAutopayNudge
					class="row-start-{placementMapping?.setupAutopay?.rowStart} col-start-{placementMapping
						?.setupAutopay?.columnStart} {placementMapping?.setupAutopay?.rowStart > 1
						? 'mt-2'
						: ''}"
				/>
			{/if}
			{#if placementMapping?.buyPortfolioCard}
				<BuyPortfolio
					class="row-start-{placementMapping?.buyPortfolioCard
						?.rowStart} col-start-{placementMapping?.buyPortfolioCard
						?.columnStart} {placementMapping?.buyPortfolioCard?.rowStart > 1 ? 'mt-2' : ''}"
				/>
			{/if}
			{#if data?.layoutConfig?.showAskAngelEntry && $tokenStore.state === AUTH_STATE_ENUM.LOGGED_IN && placementMapping?.askAngel}
				<AskAngel
					class="row-start-{placementMapping.askAngel?.rowStart} col-start-{placementMapping
						?.askAngel?.columnStart}"
				/>
			{/if}
		</div>
	</article>
{/if}

<LazyComponent
	nudgeData={startFirstSipNudgeData}
	when={showExitNudge}
	component={async () => await import('$components/ExitNudge/ExitNudgeComponent.svelte')}
/>

<style>
	.slide-down {
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transform: translateY(0%);
	}
</style>
