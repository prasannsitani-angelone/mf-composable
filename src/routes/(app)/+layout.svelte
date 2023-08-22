<script lang="ts">
	import { page as appPage } from '$app/stores';
	import { appStore } from '$lib/stores/SparkStore';
	import type { LayoutData } from './$types';
	import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { onMount, tick } from 'svelte';
	import Logger from '$lib/utils/logger';
	import Default from '$lib/layouts/Default.svelte';
	import TwoColumn from '$lib/layouts/TwoColumn.svelte';
	import TwoColumnReverse from '$lib/layouts/TwoColumnReverse.svelte';
	import TwoColumnRightLarge from '$lib/layouts/TwoColumnRightLarge.svelte';
	import FullHeightWithoutPadding from '$lib/layouts/FullHeightWithoutPadding.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { externalNavigation } from '$lib/stores/ExtrenalNavigationStore';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import Overlay from '$components/Overlay.svelte';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { logout } from '$lib/utils/helpers/logout';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { cartStore } from '$lib/stores/CartStore';
	import { shouldDisplayAngelBeeBanner } from '$lib/utils';
	import LazyComponent from '$components/LazyComponent.svelte';
	import BottomNavigation from '$components/BottomNavigation.svelte';
	import { BOTTOM_NAVBARS } from '$lib/constants/navItems';
	import Header from '$components/Headers/Header.svelte';
	import { versionStore } from '$lib/stores/VersionStore';
	import FullWidth from '$lib/layouts/FullWidth.svelte';
	import { bannerStore } from '$lib/stores/BannerStore';
	import Clevertap from '$lib/utils/Clevertap';

	$: pageMetaData = $page?.data?.layoutConfig;
	let searchFocused = false;
	const handleSearchFocus = (e: { detail: boolean }) => {
		searchFocused = e.detail;
	};
	let version = '';

	versionStore.subscribe((value) => {
		version = value.version;
	});
	$: isModalOpen = $externalNavigation.active;
	// Update store with Spark headers

	export let data: LayoutData;
	const { tokenObj, profile, userDetails, isGuest, searchDashboardData } = data;
	// Update store with Spark headers

	let showAngelBeeBanner = false;

	const initClevertap = async () => {
		await Clevertap.init();
		Clevertap.setProfile(profile);
	};
	onMount(async () => {
		profileStore.updateStore({ ...profile });
		bannerStore.storeAlertSleeveData(searchDashboardData?.banner?.[0] || {});

		await tick();

		cartStore.updateCartData(isGuest);

		showAngelBeeBanner = shouldDisplayAngelBeeBanner(data);

		if ('requestIdleCallback' in window) {
			requestIdleCallback(initClevertap, { timeout: 5000 });
		} else {
			initClevertap();
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
		await logout();
		await goto(`${base}/login?redirect=${$page.url.href}`, {
			replaceState: true
		});
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
<div class="flex-no-wrap fixed flex h-full w-full flex-col bg-grey">
	<header class="z-[70] flex-shrink-0 bg-white">
		<Header on:handleSearchFocus={handleSearchFocus} />
	</header>

	{#if $appPage.data?.layoutConfig?.layoutType === 'TWO_COLUMN'}
		<TwoColumn {searchFocused}>
			<slot />
		</TwoColumn>
	{:else if $appPage.data?.layoutConfig?.layoutType === 'TWO_COLUMN_REVERSE'}
		<TwoColumnReverse {searchFocused}>
			<slot />
		</TwoColumnReverse>
	{:else if $appPage.data?.layoutConfig?.layoutType === 'TWO_COLUMN_RIGHT_LARGE'}
		<TwoColumnRightLarge {searchFocused}>
			<slot />
		</TwoColumnRightLarge>
	{:else if $appPage.data?.layoutConfig?.layoutType === 'FULL_HEIGHT_WITHOUT_PADDING'}
		<FullHeightWithoutPadding>
			<slot />
		</FullHeightWithoutPadding>
	{:else if $appPage.data?.layoutConfig?.layoutType === 'FULL_WIDTH'}
		<FullWidth>
			<slot />
		</FullWidth>
	{:else}
		<Default {searchFocused}>
			<slot />
		</Default>
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
