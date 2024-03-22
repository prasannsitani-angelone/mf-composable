<script lang="ts">
	import PortfolioCard from '$components/PortfolioCards/PortfolioCard.svelte';
	import { page } from '$app/stores';
	import type {
		INudge,
		IRetryPaymentNudge,
		NudgeDataType,
		StartFirstSipNudgeType,
		Start4SipsNudgeType,
		EcasImportNudgeType
	} from '$lib/types/INudge';
	import { format } from 'date-fns';
	import type { IDueSips, ISip } from '$lib/types/ISipType';
	import IntersectionObserver from 'svelte-intersection-observer';

	import {
		cartEntryClickAnalytics,
		cartEntryImpressionAnalytics,
		homepageMultipleSipPaymentDueNudgeImpressionAnalytics,
		homepageNfoClickAnalytics,
		homepageSipPaymentDueNudgeImpressionAnalytics,
		nfoEntryImpressionAnalytics,
		sHomepage,
		setupAutopayCardCtaClickAnalytics,
		setupAutopayCardImpressionAnalytics,
		sipDueCardCtaClickAnalytics,
		sipDueCardImpressionAnalytics,
		sipDueCardSlideAnalytics,
		sipMissedCardCtaClickAnalytics,
		sipMissedCardImpressionAnalytics,
		sipMissedCardSlideAnalytics
	} from '$lib/analytics/DiscoverFunds';
	import type { PageData } from './$types';
	import type { StoriesData } from '$lib/types/IStories';
	import { appStore } from '$lib/stores/SparkStore';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';
	import StoriesComponent from '$components/Stories/StoriesComponent.svelte';
	import Button from '$components/Button.svelte';
	import PromotionCard from '$components/Promotions/PromotionCard.svelte';
	import { SEO, WMSIcon } from 'svelte-components';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { onMount, tick } from 'svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import MostBought from '$components/MostBought/MostBought.svelte';
	import QuickEntryPointsComponent from '../../discoverfunds/QuickEntryPoints/QuickEntryPointsComponent.svelte';
	import { versionStore } from '$lib/stores/VersionStore';
	import LazyComponent from '$components/LazyComponent.svelte';
	import CategoriesComponent from '../../discoverfunds/CategoriesComponent.svelte';
	import { askAngelEntryImpressionAnalytics } from '$lib/analytics/askangel/askangel';
	import { ctNudgeStore } from '$lib/stores/CtNudgeStore';
	import ClevertapNudgeComponent from '$components/clevertap/ClevertapNudgeComponent.svelte';
	import Clevertap from '$lib/utils/Clevertap';
	import { schemeScreenerStore } from '$lib/stores/SchemeScreenerStore';
	import TutorialNudge from '$components/Tutorial/nudge/TutorialNudge.svelte';
	import type { UserEducationNudgeType } from '$lib/types/INudge';
	import type { INotification, INotificationSummary, Notif } from '$lib/types/INotifications';
	import { base } from '$app/paths';
	import BuyPortfolio from '../../discoverfunds/BuyPortfolio.svelte';
	import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
	import AskAngel from '../../discoverfunds/AskAngel.svelte';
	import {
		actionCentreEntryImpression,
		actNowClick
	} from '$lib/analytics/pendingActionCenter/analytics';
	import Link from '$components/Link.svelte';
	import { modifiedGoto } from '$lib/utils/goto';
	import SearchComponent from '../../discoverfunds/SearchComponent.svelte';
	import HomePageVideoPlayer from '../../VideoPlayer/videoPlayer.svelte';
	import Modal from '$components/Modal.svelte';
	import TrendingFunds from '$components/TrendingFunds/TrendingFunds.svelte';
	import StartSipEntry from '$components/StartSip/StartSipEntry.svelte';
	import TopFunds from '$components/TopFunds/TopFunds.svelte';
	import TrackExternalInvestment from '../../discoverfunds/TrackExternalInvestment/TrackExternalInvestment.svelte';
	import { registerNativeResumeCallback } from '$lib/utils/nativeCallbacks';
	import { cartStore } from '$lib/stores/CartStore';
	import SetupAutopayCard from '$components/Cohorts/SetupAutopayCard.svelte';
	import QuickEntryPointsCard from '../../discoverfunds/QuickEntryPoints/QuickEntryPointsCard.svelte';
	import getactiveNfo from '$lib/api/nfo';
	import CartEntry from '$components/Cart/CartEntry.svelte';
	import PaymentOrderCard from '$components/Cohorts/PaymentOrderCard.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { SIP_ORDER_CARD_TYPES } from '$lib/constants/actions';
	import { getPendingActionsData } from '$lib/api/actions';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { getStoriesData } from '$lib/api/media';
	import StoriesSkeletonLoader from '$components/Stories/StoriesSkeletonLoader.svelte';
	import { cohorts, cohorts_LF } from '$lib/constants/cohorts';

	$: isLoggedInUser = !data?.isGuest;
	$: deviceType = $page.data.deviceType;
	$: isGuest = $page.data.isGuest;
	let sipPaymentNudges: ISip[] = [];
	let sipPaymentMonthNudges: IRetryPaymentNudge[] = [];
	let retryPaymentNudges: IRetryPaymentNudge[] = [];
	let formattedSipNudgeData: ISip;
	let formattedSipPaymentMonthNudgeData: IRetryPaymentNudge;
	let nudgesData: NudgeDataType;
	let startFirstSipNudgeData: StartFirstSipNudgeType;
	let start4SipsNudgeData: Start4SipsNudgeType;
	let ecasImportNudgeData: EcasImportNudgeType;
	let userEducationNudge: UserEducationNudgeType;
	let notifData: INotificationSummary;
	let autopayNudge: INudge | null;
	let actionsData:
		| INotification
		| { instalmentFailedOrders: []; paymentFailedOrders: []; instalmentPending: [] };
	let user_cohort =
		$page?.data?.userDetails?.cohort?.length && $page?.data?.userDetails?.cohort[0]
			? $page?.data?.userDetails?.cohort[0]
			: 'Fallback';
	let placementMapping = {};
	let videoData;
	let showVideoReelModal = false;
	let readyMadePortfolios;
	let screenerElement: HTMLElement;
	let sipCalculatorElement: HTMLElement;
	let screenerIntersect: boolean;
	let sipCalculatorIntersect: boolean;
	if ($page.data.deviceType?.isMobile || $page.data.deviceType?.isTablet) {
		placementMapping = $page.data?.cohortConfig
			? $page.data?.cohortConfig?.SF
			: cohorts.Fallback.placementMapping;
	} else {
		placementMapping = $page.data?.cohortConfig
			? $page.data?.cohortConfig?.LF
			: cohorts_LF.Fallback.placementMapping;
	}

	let formattedRetryPaymentNudgeData: IRetryPaymentNudge;
	let storiesLoaded = false;

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
				homepageMultipleSipPaymentDueNudgeImpressionAnalytics({ dueSips, version: 'B' });
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
		startFirstSipNudgeData = null;
		start4SipsNudgeData = null;
		userEducationNudge = null;
		autopayNudge = null;
		ecasImportNudgeData = null;
		(nudgesData?.nudges || [])?.forEach((item) => {
			if (item?.nudgesType === 'CREATE_YOUR_FIRST_SIP') {
				startFirstSipNudgeData = item;
			} else if (item?.nudgesType === 'START_FOUR_SIPS') {
				start4SipsNudgeData = item;
			} else if (item?.nudgesType === 'USER_EDUCATION_ENGAGEMENT') {
				userEducationNudge = item;
			} else if (item?.nudgesType === 'mandate') {
				autopayNudge = item;
			} else if (item?.nudgesType === 'ECAS_IMPORT') {
				ecasImportNudgeData = item;
			}
		});
	};

	const handlePendingSipPaymentClick = (order: Notif) => {
		if (order?.sipId) {
			const reRouteUrl = 'schemes';
			const path = `${reRouteUrl}/${normalizeFundName(
				order?.schemeName,
				order?.isin,
				order?.schemeCode
			)}`;

			let params = null;
			params = encodeObject({
				investmentType: 'SIP',
				investmentAmount: order?.installmentAmount,
				sipDate: new Date(order?.sipPaymentDate)?.getDate(),
				ftp: true,
				skipOrderPad: true,
				redirectedFrom: 'SIP_PAYMENTS',
				sipId: order?.sipId,
				sipRegistrationNumber: order?.sipRegistrationNo,
				sipDueDate: format(new Date(order?.sipPaymentDate), 'yyyy-MM-dd'),
				homepageNudge: true
			});
			modifiedGoto(`${base}/${path}?params=${params}&orderpad=INVEST`);
		} else {
			modifiedGoto(`${base}/sipbook/${order?.sipId}`);
		}
		actNowClick({
			FundName: order?.schemeName,
			Amount: order?.amount,
			Heading: `${actionsData?.instalmentPending?.length} Pending SIP Payments`,
			cta: 'paynow'
		});
	};
	const handleFailedSipPaymentClick = (order: Notif) => {
		if (order?.orderID) {
			const reRouteUrl = 'schemes';
			const path = `${reRouteUrl}/${normalizeFundName(
				order?.schemeName,
				order?.isin,
				order?.schemeCode
			)}`;
			let params = null;
			params = encodeObject({
				investmentType: 'LUMPSUM',
				investmentAmount: order?.amount,
				skipOrderPad: true,
				sipInstalmentId: order?.orderID.toString(),
				isAdditionalFlag: true,
				homepageNudge: true
			});
			modifiedGoto(`${base}/${path}?params=${params}&orderpad=INVEST`);
		} else {
			modifiedGoto(`${base}/sipbook/dashboard`);
		}
		actNowClick({
			FundName: order?.schemeName,
			Amount: order?.amount,
			Heading: `${actionsData?.instalmentFailedOrders?.length} SIP Payments Missed`,
			cta: 'paynow'
		});
	};

	let storiesData: StoriesData;

	const resetSelectedLinkedFamilyMembers = () => {
		appStore?.updateStore({ linkedmembers: { selected: [] } });
	};

	const getHomePageVideoData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/packs?packId=BEST_FUNDS_FOR_SIP`;
		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			videoData = res.data;
		}
	};

	const getReadyMadePortfolios = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/packs?packGroupId=READY_MADE_PORTFOLIO`;
		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			readyMadePortfolios = res.data?.packs || [];
		}
	};

	const handleVideoClickForDesktop = (e) => {
		const showModal = e.detail;
		showVideoReelModal = showModal;
	};

	const closeVideoReelModal = () => {
		showVideoReelModal = false;
	};

	const setAllNudgesData = () => {
		getNudgeData().then((nudgeData) => {
			setNudgeData(nudgeData);
			setSipNudgesData(nudgeData);
			setSipPaymentMonthNudgeData(nudgeData);
			setRetryPaymentNudgesData(nudgeData);
			setOtherNudgeDataTypes();
		});
	};

	const setNotificationData = () => {
		getAllNotificationsData().then((data) => {
			notifData = data;
		});

		if (!$page.data.isGuest) {
			getPendingActionsData().then((data) => {
				actionsData = data;
			});
		}
	};

	$: openNfo = 0;
	let sendNfoImpressionAnalytics = false;

	const fetchStoriesData = async () => {
		const response = await getStoriesData();
		storiesData = response.data;
	};

	onMount(async () => {
		await tick();
		versionStore.setVersion('B');

		if (placementMapping?.stories) {
			fetchStoriesData();
		}

		resetSelectedLinkedFamilyMembers();

		setAllNudgesData();

		if (placementMapping?.videoReel) {
			getHomePageVideoData();
		}

		if (placementMapping?.buyPortfolioCard) {
			getReadyMadePortfolios();
		}

		setNotificationData();

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

		registerNativeResumeCallback(onVisibilityChange);

		const nfoList = await getactiveNfo();
		openNfo = nfoList?.length;

		if (sendNfoImpressionAnalytics) {
			nfoEntryImpressionAnalyticsFunc();
		}
	});

	const initializeClevertapData = async () => {
		const cleavertap = await Clevertap.initialized;
		cleavertap.event.push('MF Discover', {
			event_type: 'impression'
		});
	};

	export let data: PageData;

	const onVisibilityChange = () => {
		setAllNudgesData();
		setNotificationData();
		schemeScreenerStore?.reinitializeStore();
		cartStore.updateCartData(isGuest);
	};

	const getSipDueDateMetadata = (orderDate: number) => {
		const today = new Date();
		const inputDate = new Date(orderDate);
		if (today?.toDateString() === inputDate?.toDateString()) {
			return 'Due Today';
		} else {
			return `Due on ${getDateTimeString(orderDate)}`;
		}
	};

	const toggleSendNfoEntryImpressionAnalytics = () => {
		sendNfoImpressionAnalytics = !sendNfoImpressionAnalytics;
	};

	const nfoEntryImpressionAnalyticsFunc = () => {
		const eventMetaData = {
			NumberOfNFO: openNfo || 0
		};

		nfoEntryImpressionAnalytics(eventMetaData);
	};

	const sipDueCardImpressionAnalyticsFunc = () => {
		const sipListMetaData = (actionsData?.instalmentPending || [])?.map((item, index) => {
			return {
				FundIndex: index,
				FundName: item?.schemeName,
				Amount: item?.amount,
				DueStatus: getSipDueDateMetadata(item?.sipPaymentDate)
			};
		});

		const eventMetaData = {
			SIPcount: (actionsData?.instalmentPending || [])?.length,
			SIPs: sipListMetaData
		};

		sipDueCardImpressionAnalytics(eventMetaData);
	};

	const sipDueCardCtaClickAnalyticsFunc = (currentIndex: number) => {
		const currentIndexSip = actionsData?.instalmentPending[currentIndex];

		const eventMetaData = {
			FundIndex: currentIndex,
			FundName: currentIndexSip?.schemeName,
			Amount: currentIndexSip?.amount,
			DueStatus: getSipDueDateMetadata(currentIndexSip?.sipPaymentDate)
		};

		sipDueCardCtaClickAnalytics(eventMetaData);
	};

	const sipMissedCardImpressionAnalyticsFunc = () => {
		const sipListMetaData = (actionsData?.instalmentFailedOrders || [])?.map((item, index) => {
			return {
				FundIndex: index,
				FundName: item?.schemeName,
				Amount: item?.amount,
				DueStatus: `Overdue`
			};
		});

		const eventMetaData = {
			SIPcount: (actionsData?.instalmentFailedOrders || [])?.length,
			SIPs: sipListMetaData
		};

		sipMissedCardImpressionAnalytics(eventMetaData);
	};

	const sipMissedCardCtaClickAnalyticsFunc = (currentIndex: number) => {
		const currentIndexSip = actionsData?.instalmentFailedOrders[currentIndex];

		const eventMetaData = {
			FundIndex: currentIndex,
			FundName: currentIndexSip?.schemeName,
			Amount: currentIndexSip?.amount,
			DueStatus: `Overdue`
		};

		sipMissedCardCtaClickAnalytics(eventMetaData);
	};

	const setupAutopayCardImpressionAnalyticsFunc = (heading: string) => {
		const eventMetaData = {
			Heading: heading || '',
			Text: 'Your SIP Installments will not be autopaid'
		};

		setupAutopayCardImpressionAnalytics(eventMetaData);
	};
</script>

<SEO
	seoTitle="Find The Right Mutual Fund For Your Needs | Angel One"
	seoDescription="Set your Goals and find the right Mutual Funds to achieve your goal. Explore mutual funds by performance and start your investment journey with Angel One."
/>

<article class="-mt-2 grid grid-cols-[100%] md:mt-0">
	<!-- 1. Portfolio Card  -->
	<div class="row-start-{placementMapping.investments?.rowStart} col-start-1 sm:hidden">
		{#if isLoggedInUser && deviceType?.isMobile && placementMapping?.investments}
			{#if data?.investementSummary?.currentValue}
				<div
					class="{placementMapping.investments?.rowStart > 1 ? 'mt-2' : ''} block overflow-hidden"
				>
					<PortfolioCard discoverPage={true} investmentSummary={data.investementSummary} />
				</div>
			{/if}
		{/if}
	</div>

	<!-- 2. Search section -->
	{#if $appStore.isTabView}
		<Link
			to={`/search`}
			ariaLabel="search"
			class="row-start-{placementMapping?.search?.rowStart} col-start-{placementMapping?.search
				?.columnStart}"
		>
			<SearchComponent />
		</Link>
	{/if}

	<!-- 3. Stories section -->
	{#if !storiesLoaded && placementMapping?.stories && !placementMapping?.videoReel}
		<StoriesSkeletonLoader />
	{/if}
	<!-- 1. Stories section -->
	{#if storiesData?.stories?.length && placementMapping?.stories && !placementMapping?.videoReel}
		{#if storiesLoaded}
			<StoriesComponent
				class="row-start-{placementMapping?.stories?.rowStart} col-start-{placementMapping?.stories
					?.columnStart} !mb-0 {placementMapping?.stories?.rowStart > 1 ? 'mt-2' : ''}"
				stories={storiesData?.stories}
				version="A"
			/>
		{/if}
	{/if}

	{#if userEducationNudge && deviceType?.isMobile && placementMapping?.tutorials}
		<TutorialNudge
			title={userEducationNudge.heading}
			subTitle={userEducationNudge.description}
			class="h-fit row-start-{placementMapping?.tutorials?.rowStart} col-start-{placementMapping
				?.tutorials?.columnStart} !mb-0 {placementMapping?.tutorials?.rowStart > 1 ? 'mt-2' : ''}"
		/>
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

	{#if placementMapping?.buyPortfolioCard && readyMadePortfolios?.length && deviceType.isBrowser}
		<BuyPortfolio
			class="row-start-{placementMapping?.buyPortfolioCard?.rowStart} col-start-{placementMapping
				?.buyPortfolioCard?.columnStart} {placementMapping?.buyPortfolioCard?.rowStart > 1
				? 'mt-2'
				: ''}"
			portfolios={readyMadePortfolios}
		/>
	{/if}

	<!-- Start SIP -->
	{#if placementMapping?.startSip}
		<StartSipEntry
			class="row-start-{placementMapping?.startSip?.rowStart} col-start-{placementMapping?.startSip
				?.columnStart} !my-0 {placementMapping?.startSip?.rowStart > 1 ? '!mt-2' : ''}"
		/>
	{/if}

	<!-- 4. Most Bought Section -->
	{#if placementMapping?.mostBought && data?.searchDashboardData?.weeklyTopSchemes?.length}
		<MostBought
			class="row-start-{placementMapping?.mostBought?.rowStart} col-start-{placementMapping
				?.mostBought?.columnStart} !my-0 {placementMapping?.mostBought?.rowStart > 1
				? '!mt-2'
				: ''}"
			tableData={data?.searchDashboardData?.weeklyTopSchemes}
			version="B"
		/>
	{/if}

	<!-- 6. Category Section -->
	{#if placementMapping?.categories}
		<article
			class="row-start-{placementMapping?.categories?.rowStart} col-start-{placementMapping
				?.categories?.columnStart} mt-2"
		>
			<CategoriesComponent categories={data?.searchDashboardData?.categories} />
		</article>
	{/if}

	<!-- Trending Funds -->
	{#if placementMapping?.trendingFunds && data?.trendingFundsData?.length}
		<TrendingFunds
			fundList={data?.trendingFundsData}
			class="row-start-{placementMapping?.trendingFunds?.rowStart} col-start-{placementMapping
				?.trendingFunds?.columnStart} !my-0 {placementMapping?.trendingFunds?.rowStart > 1
				? '!mt-2'
				: ''}"
		/>
	{/if}

	<!-- Top Funds List -->
	{#if placementMapping?.topFundsList}
		<TopFunds
			tableData={data?.searchDashboardData?.categories}
			class="row-start-{placementMapping?.topFundsList?.rowStart} col-start-{placementMapping
				?.topFundsList?.columnStart} !my-0 {placementMapping?.topFundsList?.rowStart > 1
				? '!mt-2'
				: ''}"
		/>
	{/if}

	{#if ecasImportNudgeData && placementMapping?.trackExtFunds}
		<TrackExternalInvestment
			class="row-start-{placementMapping?.trackExtFunds?.rowStart} col-start-{placementMapping
				?.trackExtFunds?.columnStart} {placementMapping?.trackExtFunds?.rowStart > 1
				? '!mt-2'
				: ''}"
			nudge={ecasImportNudgeData}
		/>
	{/if}

	{#if placementMapping?.sipCalculator}
		<IntersectionObserver
			once
			element={sipCalculatorElement}
			bind:intersecting={sipCalculatorIntersect}
		>
			<div
				bind:this={sipCalculatorElement}
				class="row-start-{placementMapping?.sipCalculator?.rowStart} col-start-{placementMapping
					?.sipCalculator?.columnStart} {placementMapping?.sipCalculator?.rowStart > 1
					? '!mt-2'
					: ''}"
			>
				<LazyComponent
					when={sipCalculatorIntersect}
					component={async () =>
						await import('../../discoverfunds/SipCalculator/SipCalculatorComponent.svelte')}
				/>
			</div>
		</IntersectionObserver>
	{/if}

	<!-- Video component -->

	{#if placementMapping?.videoReel && videoData?.packs?.length && deviceType?.isMobile}
		<div
			class="row-start-{placementMapping?.videoReel?.rowStart} col-start-{placementMapping
				?.videoReel?.columnStart} mt-2"
		>
			<HomePageVideoPlayer videoData={videoData.packs[0]} source="Normal" />
		</div>
	{/if}

	<!-- Cart New Entry Point -->
	<CartEntry
		cartItemCount={$cartStore?.count}
		on:cartEntryMount={() => cartEntryImpressionAnalytics({ NoOfItems: $cartStore.count })}
		on:cartEntryClick={() => cartEntryClickAnalytics({ NoOfItems: $cartStore.count })}
	/>

	<!-- 9. Quick Entry Points - External Funds, NFO, Calculator -->
	{#if placementMapping?.quickEntryPoints}
		<QuickEntryPointsComponent
			class="row-start-{placementMapping?.quickEntryPoints?.rowStart} col-start-{placementMapping
				?.quickEntryPoints?.columnStart} {placementMapping?.quickEntryPoints?.rowStart > 1
				? 'mt-2'
				: ''}"
			{isGuest}
		/>
	{/if}

	<!-- NFO Entry Point -->
	{#if placementMapping?.nfoEntry}
		<section
			class="row-start-{placementMapping?.nfoEntry?.rowStart} col-start-{placementMapping?.nfoEntry
				?.columnStart} {placementMapping?.nfoEntry?.rowStart > 1 ? 'mt-2' : ''}"
		>
			<QuickEntryPointsCard
				title="New Fund Offerings"
				subtitle={`Explore ${openNfo} NFOs currently live`}
				liveNFO={openNfo}
				onLinkClicked={() => homepageNfoClickAnalytics(openNfo)}
				to="/nfo"
				class="rounded-lg"
				subtitleClass="text-xs font-normal text-body"
				on:entryCardMounted={toggleSendNfoEntryImpressionAnalytics}
			>
				<div
					slot="icon"
					class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--B-100)]"
				>
					<WMSIcon name="announcement-white" stroke="var(--PRIMARY)" />
				</div>
			</QuickEntryPointsCard>
		</section>
	{/if}

	{#if !deviceType?.isBrowser && autopayNudge && placementMapping?.setupAutopay && !actionsData?.instalmentPending?.length}
		<SetupAutopayCard
			sipPendingCount={autopayNudge?.data?.sipCount}
			sipTotalAmount={autopayNudge?.amount}
			on:autopayCardMount={(e) => setupAutopayCardImpressionAnalyticsFunc(e?.detail)}
			on:autopayCardClick={setupAutopayCardCtaClickAnalytics}
			class="row-start-{placementMapping?.setupAutopay?.rowStart} col-start-{placementMapping
				?.setupAutopay?.columnStart} {placementMapping?.setupAutopay?.rowStart > 1 ? 'mt-2' : ''}"
		/>
	{/if}

	{#if !deviceType?.isBrowser && placementMapping?.sipPaymentDue && actionsData?.instalmentPending?.length}
		<PaymentOrderCard
			sipList={actionsData?.instalmentPending || []}
			cardType={SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_DUE}
			pageSource={'discoverfunds-B'}
			on:buttonClick={(e) => handlePendingSipPaymentClick(e?.detail)}
			on:paymentOrderCardMount={sipDueCardImpressionAnalyticsFunc}
			on:paymentOrderCardSlide={sipDueCardSlideAnalytics}
			on:paymentOrderCardItemClick={(e) => sipDueCardCtaClickAnalyticsFunc(e?.detail)}
			class="row-start-{placementMapping?.sipPaymentDue?.rowStart} col-start-{placementMapping
				?.sipPaymentDue?.columnStart} {placementMapping?.sipPaymentDue?.rowStart > 1 ? 'mt-2' : ''}"
		/>
	{/if}

	{#if !deviceType?.isBrowser && placementMapping?.sipPaymentMissed && actionsData?.instalmentFailedOrders?.length}
		<PaymentOrderCard
			sipList={actionsData?.instalmentFailedOrders || []}
			cardType={SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_MISSED}
			pageSource={'discoverfunds-B'}
			on:buttonClick={(e) => handleFailedSipPaymentClick(e?.detail)}
			on:paymentOrderCardMount={sipMissedCardImpressionAnalyticsFunc}
			on:paymentOrderCardSlide={sipMissedCardSlideAnalytics}
			on:paymentOrderCardItemClick={(e) => sipMissedCardCtaClickAnalyticsFunc(e?.detail)}
			class="row-start-{placementMapping?.sipPaymentMissed?.rowStart} col-start-{placementMapping
				?.sipPaymentMissed?.columnStart} {placementMapping?.sipPaymentMissed?.rowStart > 1
				? 'mt-2'
				: ''}"
		/>
	{/if}

	{#if !deviceType?.isBrowser && placementMapping?.buyPortfolioCard && readyMadePortfolios?.length}
		<BuyPortfolio
			class="row-start-{placementMapping?.buyPortfolioCard?.rowStart} col-start-{placementMapping
				?.buyPortfolioCard?.columnStart} {placementMapping?.buyPortfolioCard?.rowStart > 1
				? 'mt-2'
				: ''}"
			portfolios={readyMadePortfolios}
		/>
	{/if}

	{#if !deviceType?.isBrowser && data?.layoutConfig?.showAskAngelEntry && $tokenStore.state === AUTH_STATE_ENUM.LOGGED_IN && placementMapping?.askAngel}
		<AskAngel
			class="row-start-{placementMapping?.askAngel?.rowStart} col-start-{placementMapping?.askAngel
				?.columnStart} {placementMapping?.askAngel?.rowStart > 1 ? 'mt-2' : ''}"
		/>
	{/if}

	<!-- 10. PromotionCard -->
	{#if data?.searchDashboardData?.amcAd && placementMapping?.promotionCard}
		<PromotionCard
			amcData={data.searchDashboardData.amcAd}
			class="row-start-{placementMapping?.promotionCard?.rowStart} col-start-{placementMapping
				?.promotionCard?.columnStart} rounded-lg text-center sm:hidden {placementMapping
				?.promotionCard?.rowStart > 1
				? 'mt-2'
				: ''}"
			imageClass="h-32 md:h-42 lg:h-32 w-full object-cover"
		/>
	{/if}

	{#if placementMapping?.screener}
		<IntersectionObserver once element={screenerElement} bind:intersecting={screenerIntersect}>
			<div
				bind:this={screenerElement}
				class="row-start-{placementMapping?.screener?.rowStart} col-start-{placementMapping
					?.screener?.columnStart}"
			>
				<LazyComponent
					imageClass="h-32 md:h-42 lg:h-32 w-full object-cover"
					when={screenerIntersect}
					component={async () => await import('$lib/components/Screener/ScreenerHome.svelte')}
				/>
			</div>
		</IntersectionObserver>
	{/if}

	<!-- 11. Logout -->
	{#if placementMapping?.logout && !($appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID || $appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS) && !isGuest}
		<article
			class="row-start-{placementMapping?.logout?.rowStart} col-start-{placementMapping?.logout
				?.columnStart} flex justify-center sm:hidden"
		>
			<Button
				variant="transparent"
				class="mt-2 !w-min !bg-transparent !text-primary"
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

<article class="sticky -top-2 hidden grid-cols-[100%] sm:grid" style="height:min-content">
	{#if placementMapping?.videoReel && videoData?.packs?.length && !deviceType?.isMobile}
		<div
			class="p-1 row-start-{placementMapping?.videoReel?.rowStart} {placementMapping?.videoReel
				?.rowStart > 1
				? 'mt-2'
				: ''}"
		>
			<HomePageVideoPlayer
				videoData={videoData.packs[0]}
				on:reel-click={handleVideoClickForDesktop}
				source="Normal"
			/>
		</div>
	{/if}
	<div class="row-start-{placementMapping.investments?.rowStart} col-start-1">
		{#if isLoggedInUser && data.investementSummary?.currentValue && placementMapping?.investments}
			<div class="block overflow-hidden">
				<PortfolioCard discoverPage={true} investmentSummary={data.investementSummary} />
			</div>
		{/if}
	</div>

	{#if $ctNudgeStore?.kv?.topic === 'mf_discover_inpage1_type_d'}
		{#if deviceType?.isBrowser}
			<ClevertapNudgeComponent
				class="row-start-{placementMapping?.ctNudge?.rowStart} mt-2 w-full rounded-lg"
				data={$ctNudgeStore}
				on:onCTAClicked={(e) => modifiedGoto(e.detail.url)}
			/>
		{/if}
	{/if}

	{#if data?.searchDashboardData?.amcAd && placementMapping?.promotionCard}
		<PromotionCard
			amcData={data.searchDashboardData.amcAd}
			class="row-start-{placementMapping.promotionCard
				?.rowStart} col-start-1 mt-3 rounded-lg text-center"
			imageClass="h-32 md:h-42 lg:h-32 w-full object-cover"
		/>
	{/if}
	{#if autopayNudge && placementMapping?.setupAutopay && !actionsData?.instalmentPending?.length}
		<SetupAutopayCard
			sipPendingCount={autopayNudge?.data?.sipCount}
			sipTotalAmount={autopayNudge?.amount}
			on:autopayCardMount={(e) => setupAutopayCardImpressionAnalyticsFunc(e?.detail)}
			on:autopayCardClick={setupAutopayCardCtaClickAnalytics}
			class="row-start-{placementMapping?.setupAutopay?.rowStart} {placementMapping?.setupAutopay
				?.rowStart > 1
				? 'mt-2'
				: ''}"
		/>
	{/if}
	{#if placementMapping?.sipPaymentDue && actionsData?.instalmentPending?.length}
		<PaymentOrderCard
			sipList={actionsData?.instalmentPending || []}
			cardType={SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_DUE}
			pageSource={'discoverfunds-B'}
			on:buttonClick={(e) => handlePendingSipPaymentClick(e?.detail)}
			on:paymentOrderCardMount={sipDueCardImpressionAnalyticsFunc}
			on:paymentOrderCardSlide={sipDueCardSlideAnalytics}
			on:paymentOrderCardItemClick={(e) => sipDueCardCtaClickAnalyticsFunc(e?.detail)}
			class="row-start-{placementMapping?.sipPaymentDue?.rowStart} {placementMapping?.sipPaymentDue
				?.rowStart > 1
				? 'mt-2'
				: ''}"
		/>
	{/if}

	{#if placementMapping?.sipPaymentMissed && actionsData?.instalmentFailedOrders?.length}
		<PaymentOrderCard
			sipList={actionsData?.instalmentFailedOrders || []}
			cardType={SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_MISSED}
			pageSource={'discoverfunds-B'}
			on:buttonClick={(e) => handleFailedSipPaymentClick(e?.detail)}
			on:paymentOrderCardMount={sipMissedCardImpressionAnalyticsFunc}
			on:paymentOrderCardSlide={sipMissedCardSlideAnalytics}
			on:paymentOrderCardItemClick={(e) => sipMissedCardCtaClickAnalyticsFunc(e?.detail)}
			class="row-start-{placementMapping?.sipPaymentMissed?.rowStart} {placementMapping
				?.sipPaymentMissed?.rowStart > 1
				? 'mt-2'
				: ''}"
		/>
	{/if}
	{#if data?.layoutConfig?.showAskAngelEntry && $tokenStore.state === AUTH_STATE_ENUM.LOGGED_IN && placementMapping?.askAngel}
		<AskAngel class="row-start-{placementMapping.askAngel?.rowStart}" />
	{/if}
</article>
<Modal isModalOpen={showVideoReelModal} on:backdropclicked={closeVideoReelModal}>
	<HomePageVideoPlayer
		videoData={videoData.packs[0]}
		source="Modal"
		on:reel-click={handleVideoClickForDesktop}
	/>
</Modal>

<style>
	.slide-down {
		will-change: transform;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transform: translateY(0) translateZ(0);
	}
</style>
