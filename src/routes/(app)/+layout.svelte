<script lang="ts">
	import { page as appPage, page } from '$app/stores';
	import { appStore } from '$lib/stores/SparkStore';
	import type { LayoutData } from './$types';
	import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { onDestroy, onMount, tick } from 'svelte';
	import Logger from '$lib/utils/logger';
	import Default from '$lib/layouts/Default.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { externalNavigation } from '$lib/stores/ExtrenalNavigationStore';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import Overlay from '$components/Overlay.svelte';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { logout } from '$lib/utils/helpers/logout';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';

	import { onNavigate } from '$app/navigation';
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
	import { browserHistoryStore } from '$lib/stores/BrowserHistoryStore';
	import type { AnimationArguments } from 'svelte-components';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import NotificationsStore from '$lib/stores/NotificationStore';
	import NudgeStore from '$lib/stores/NudgeStore';
	import { bottomTabStore } from '$lib/stores/BottomTabStore';

	$: pageMetaData = $page?.data?.layoutConfig;
	$: isMobile = $page?.data?.deviceType?.isMobile;
	const versionViaQuery = $page.url.searchParams.get('version');
	let searchFocused = false;
	const handleSearchFocus = (e: { detail: boolean }) => {
		searchFocused = e.detail;
	};
	let version = '';
	let isBack = false;

	$: isModalOpen = $externalNavigation.active;
	// Update store with Spark headers

	export let data: LayoutData;
	const { tokenObj, profile, userDetails, isGuest, searchDashboardData } = data;
	// Update store with Spark headers

	let showAngelBeeBanner = false;

	const initClevertap = async () => {
		useFetch(`${PUBLIC_MF_CORE_BASE_URL}/events`, {
			method: 'POST',
			body: JSON.stringify({
				type: 'CLEVERTAP'
			})
		});
		requestAnimationFrame(async () => {
			await Clevertap.init();
			Clevertap.setProfile(profile);
		});
	};

	const popStateListener = () => {
		// The popstate event is fired each time when the current history entry changes.
		isBack = true;
	};

	onMount(async () => {
		if (versionViaQuery) {
			versionStore.setVersion(versionViaQuery);
		}
		versionStore.subscribe((value) => {
			version = value.version;
		});
		profileStore.updateStore({ ...profile });
		bannerStore.storeAlertSleeveData(searchDashboardData?.banner?.[0] || {});

		NotificationsStore.fetchNewNotifications(isGuest);
		NudgeStore.fetchNewNudges(isGuest);

		await tick();

		cartStore.updateCartData(isGuest);

		showAngelBeeBanner = shouldDisplayAngelBeeBanner(data);

		if (!isGuest && !appStore.isSparkGuestUser()) {
			if ('requestIdleCallback' in window) {
				requestIdleCallback(initClevertap, { timeout: 5000 });
			} else {
				initClevertap();
			}
		}
		document.addEventListener('CT_web_native_display', function (event) {
			const data = event.detail;
			Logger.info({
				type: 'CT_web_native_display',
				params: data
			});
			ctNudgeStore.set(data);
		});

		browserHistoryStore.updateStore({
			isLoaded: true,
			initialUrl: `${$page.url.origin}${$page.url.pathname}`,
			historyLength: window.history.length
		});

		window.addEventListener('popstate', popStateListener, false);
	});
	onDestroy(() => {
		if (browser) {
			window.removeEventListener('popstate', popStateListener, false);
		}
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

	onNavigate(() => {
		browserHistoryStore.updateStore({
			historyLength: window.history.length
		});
	});

	const animate = (node: Element, args: AnimationArguments) => (args.cond ? fly(node, args) : {});
	const getDirection = () => {
		if (isBack) {
			isBack = false;
			return '-100%';
		}
		return '100%';
	};

	const isAnimationEnabled = () => {
		if ($bottomTabStore.clicked) {
			bottomTabStore.resetStore();
			return false;
		}
		return true;
	};
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
{#key data.pathname}
	<div
		class="flex-no-wrap fixed flex h-full w-full flex-col bg-background"
		in:animate={{
			x: getDirection(),
			easing: cubicOut,
			duration: 300,
			cond: isMobile && isAnimationEnabled()
		}}
	>
		<header class="z-[70] flex-shrink-0 bg-background-alt">
			<Header on:handleSearchFocus={handleSearchFocus} />
		</header>
		<!-- <TwoColumnRightLarge {searchFocused}>
		<slot />
	</TwoColumnRightLarge> -->

		<Default {searchFocused} layoutType={$appPage.data?.layoutConfig?.layoutType}>
			<slot />
		</Default>

		{#if pageMetaData?.showBottomNavigation}
			<footer>
				<BottomNavigation navs={BOTTOM_NAVBARS(version)} />
			</footer>
		{/if}
	</div>
{/key}
{#if isModalOpen}
	<Overlay containerClass="!justify-center sm:!justify-center">
		<LoadingIndicator svgClass={'!w-16 !h-16'} />
	</Overlay>
{/if}
{#if ($appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID || $appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS) && $tokenStore.state === AUTH_STATE_ENUM.LOGGED_OUT && !appStore.isSparkGuestUser()}
	<ResultPopup
		popupType="FAILURE"
		title="You have been logged out"
		text="Please close the app and open again."
		class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen
		preventBackDropClick
	>
		<div slot="popupFooter" />
	</ResultPopup>
{:else if $tokenStore.state === AUTH_STATE_ENUM.LOGGED_OUT && !appStore.isSparkGuestUser()}
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
		preventBackDropClick
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
