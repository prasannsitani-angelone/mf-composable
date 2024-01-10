<script lang="ts">
	import { page as appPage, page } from '$app/stores';
	import { appStore } from '$lib/stores/SparkStore';
	import type { LayoutData } from './$types';
	import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { onMount, tick } from 'svelte';
	import Logger from '$lib/utils/logger';
	import Default from '$lib/layouts/Default.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { externalNavigation } from '$lib/stores/ExtrenalNavigationStore';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import Overlay from '$components/Overlay.svelte';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { logout } from '$lib/utils/helpers/logout';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';

	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { cartStore } from '$lib/stores/CartStore';
	import { shouldDisplayAngelBeeBanner } from '$lib/utils';
	import LazyComponent from '$components/LazyComponent.svelte';
	import BottomNavigation from '$components/BottomNavigation.svelte';
	import { BOTTOM_NAVBARS } from '$lib/constants/navItems';
	import Header from '$components/Headers/Header.svelte';
	import { versionStore } from '$lib/stores/VersionStore';
	import { bannerStore } from '$lib/stores/BannerStore';
	import Clevertap from '$lib/utils/Clevertap';
	import { useFetch } from '$lib/utils/useFetch';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { ctNudgeStore } from '$lib/stores/CtNudgeStore';
	import AskAngelEntry from '$components/AskAngel/AskAngelEntry.svelte';
	import { cubicOut } from 'svelte/easing';
	import type { AnimationArguments } from 'svelte-components';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { onLCP, onTTFB, onFCP, onINP, onCLS } from 'web-vitals/attribution';
	import { logWebVitals } from '$lib/utils/webVitals';

	function logDelta(metric) {
		logWebVitals(metric?.name, metric);
	}
	if (browser) {
		onCLS(logDelta);
		onINP(logDelta);
		onLCP(logDelta);
		onFCP(logDelta);
		onTTFB(logDelta);
	}

	$: pageMetaData = $page?.data?.layoutConfig;
	let searchFocused = false;
	const handleSearchFocus = (e: { detail: boolean }) => {
		searchFocused = e.detail;
	};
	let version = '';

	$: isModalOpen = $externalNavigation.active;
	// Update store with Spark headers

	export let data: LayoutData;
	const { tokenObj, profile, userDetails, isGuest, searchDashboardData } = data;
	// Update store with Spark headers

	let showAngelBeeBanner = false;
	let isBack = false;

	const animate = (node: Element, args: AnimationArguments) => (args.cond ? fly(node, args) : {});
	$: isMobile = $page?.data?.deviceType?.isMobile;

	const getDirection = () => {
		if (isBack) {
			isBack = false;
			return '-100%';
		}
		return '100%';
	};

	const initClevertap = async () => {
		useFetch(`${PUBLIC_MF_CORE_BASE_URL}/events`, {
			method: 'POST',
			body: JSON.stringify({
				type: 'CLEVERTAP'
			})
		});
		await Clevertap.init();
		Clevertap.setProfile(profile);
	};
	onMount(async () => {
		versionStore.subscribe((value) => {
			version = value.version;
		});
		profileStore.updateStore({ ...profile });
		bannerStore.storeAlertSleeveData(searchDashboardData?.banner?.[0] || {});

		await tick();

		cartStore.updateCartData(isGuest);

		showAngelBeeBanner = shouldDisplayAngelBeeBanner(data);

		versionStore.subscribe((value) => {
			version = value.version;
		});

		if ('requestIdleCallback' in window) {
			requestIdleCallback(initClevertap, { timeout: 5000 });
		} else {
			initClevertap();
		}
		document.addEventListener('CT_web_native_display', function (event) {
			const data = event.detail;
			Logger.info({
				type: 'CT_web_native_display',
				params: data
			});
			ctNudgeStore.set(data);
		});

		window.addEventListener(
			'popstate',
			function (event) {
				console.log(event);
				// The popstate event is fired each time when the current history entry changes.
				isBack = true;
			},
			false
		);

		handleBackHistoryForDeeplinks();
	});
	// initialising logging again with all new headers for routes of (app)

	Logger.updateConfig({
		headers: {
			accessToken: isGuest ? tokenObj?.guestToken : tokenObj?.userToken?.NTAccessToken,
			userId: profile?.clientId || ''
		}
	});
	const navigateToLoginPage = async () => {
		await logout($page.url.href, $page.url.origin);
	};

	/**
	 * Handles direct deeplinks to the (app) route pages directly, and not from discoverfunds page.
	 * adds the discoverfunds history entry and checks with the popstate event
	 */
	function handleBackHistoryForDeeplinks() {
		let isDiscoverFundsPath = $page.url?.pathname?.includes('/discoverfunds');

		const { platform } = data.sparkHeaders;
		// if this page is directly invoked and is not discoverfunds page
		if (
			(platform?.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID ||
				platform?.toLowerCase() === PLATFORM_TYPE.SPARK_IOS) &&
			history.length === 1 &&
			!isDiscoverFundsPath
		) {
			// mutate history, add path to state object. will be used in popstate event
			const discoverfundsUrl = `${base}/discoverfunds`;
			history.replaceState({ path: discoverfundsUrl }, '', discoverfundsUrl);
			history.pushState({ path: $page.url.href }, '', $page.url.href);

			// when using replaceState/pushState popstate event needs to be handled
			window.addEventListener('popstate', function (e) {
				// if pop event state has path key, route to that path
				if (e.state.path) {
					e.preventDefault();
					goto(e.state.path, { replaceState: true });
				}
			});
		}
	}
</script>

<noscript>
	<iframe
		title="JS is disabled"
		src="/mutual-funds/no-js"
		frameborder="0"
		width="0"
		height="0"
		style="visibility: hidden;"
	/>
</noscript>
<div class="flex-no-wrap fixed flex h-full w-full flex-col bg-grey">
	<header class="z-[70] flex-shrink-0 bg-white">
		<Header on:handleSearchFocus={handleSearchFocus} />
	</header>
	<!-- <TwoColumnRightLarge {searchFocused}>
		<slot />
	</TwoColumnRightLarge> -->

	<Default {searchFocused} layoutType={$appPage.data?.layoutConfig?.layoutType}>
		{#key data.pathname}
			<div
				in:animate={{
					x: getDirection(),
					easing: cubicOut,
					duration: 300,
					cond: isMobile
				}}
			>
				<slot />
			</div>
		{/key}
	</Default>

	{#if pageMetaData?.showAskAngelEntry && $tokenStore.state === AUTH_STATE_ENUM.LOGGED_IN}
		<AskAngelEntry />
	{/if}
	{#if pageMetaData?.showBottomNavigation}
		<footer>
			<BottomNavigation navs={BOTTOM_NAVBARS(version)} />
		</footer>
	{/if}
</div>
{#if isModalOpen}
	<Overlay containerClass="!justify-center sm:!justify-center">
		<LoadingIndicator svgClass={'!w-16 !h-16'} />
	</Overlay>
{/if}
{#if ($appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID || $appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS) && $tokenStore.state === AUTH_STATE_ENUM.LOGGED_OUT}
	<ResultPopup
		popupType="FAILURE"
		title="You have been logged out"
		text="Please close the app and open again."
		class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen
	>
		<div slot="popupFooter" />
	</ResultPopup>
{:else if $tokenStore.state === AUTH_STATE_ENUM.LOGGED_OUT}
	<ResultPopup
		popupType="FAILURE"
		title="You have been logged out"
		text="You will be redirected to login page"
		class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen
		handleButtonClick={navigateToLoginPage}
		buttonTitle="DONE"
		buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
		buttonVariant="contained"
	/>
{/if}
<LazyComponent
	when={userDetails?.panSeeded === false}
	component={async () => await import('$components/AlertSleeve.svelte')}
	heading="Pan Aadhaar Seeding is not completed"
	subHeading={[
		'1. Pan Aadhaar seeding is mandatory for all Mutual Fund Transactions wef 1st July 2021.',
		'2. In case the seeding is not completed, your orders will fail and any money debited will be refunded in 5-7 working days.',
		'3. Click the below button for guidelines on Seeding Pan Card with an Aadhaar card.'
	]}
	buttonText="Link Aadhaar With Pan"
	onSubmit={() =>
		window.open(
			'https://www.angelone.in/knowledge-center/demat-account/how-to-link-your-aadhaar-number-with-demat-account',
			'_blank'
		)}
/>
<LazyComponent
	when={$logoutAttemptStore.logoutAttempt}
	component={async () => await import('$components/Logout/LogoutPopup.svelte')}
/>
<LazyComponent
	when={$cartStore.repetetiveAddAttempt}
	component={async () => await import('$components/Cart/AddToCartPopup.svelte')}
/>

<LazyComponent
	when={$cartStore.removeFromCart}
	component={async () => await import('$components/Cart/RemoveFromCartPopup.svelte')}
/>

<LazyComponent
	when={showAngelBeeBanner}
	component={async () => await import('../banner/AngelBeeBannerComponent.svelte')}
/>

<LazyComponent when={true} component={async () => await import('$components/Toast/Toast.svelte')} />

<LazyComponent
	when={$bannerStore.alertSleeveVisible}
	component={async () => await import('$components/AlertSleeve.svelte')}
	heading={$bannerStore.notificationTitle}
	subHeading={[$bannerStore.notificationBody]}
	onSubmit={bannerStore.hideLogoutConfirmationPopup}
	onBackDropClicked={bannerStore.hideLogoutConfirmationPopup}
	link={$bannerStore.knowMore}
	subHeadingClass="!text-center"
/>
