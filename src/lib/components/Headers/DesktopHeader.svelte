<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import Link from '../Link.svelte';
	import { page } from '$app/stores';
	import { createEventDispatcher, onMount } from 'svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import Overlay from '$components/Modal.svelte';
	import Dropdown from '$components/Dropdown.svelte';
	import { userActionStore } from '$lib/stores/UserActionStore';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';
	import { reportsEntryDesktopAnalytics } from '$lib/analytics/reports/reports';
	import { tabClickNavigationAnalytics } from '$lib/analytics/DiscoverFunds';
	import { cartStore } from '$lib/stores/CartStore';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { allFaqsProfileCtaClick } from '$lib/analytics/faqs/faqs';

	const onReportsButtonClick = () => {
		userActionStore.hideUserActionDropDown();
		reportsEntryDesktopAnalytics();
		goto(`${base}/reports`);
	};

	const onFaqsButtonClick = () => {
		allFaqsProfileCtaClick();
		userActionStore.hideUserActionDropDown();

		const faqParams = encodeObject({
			tag: 'all',
			showRecentOrders: true
		});

		goto(`${base}/faqs?params=${faqParams}`);
	};

	const onLogoutButtonClick = () => {
		userActionStore.hideUserActionDropDown();
		logoutAttemptStore.showLogoutConfirmationPopup();
	};

	$: isGuest = $page.data?.isGuest;
	$: userName = $page.data?.profile?.clientDetails?.fullName || '';
	$: isBrowser = $page.data.deviceType.isBrowser;
	let SearchDynamicComponent;

	onMount(async () => {
		if (isBrowser) {
			SearchDynamicComponent = (await import('$lib/components/Search/SearchComponent.svelte'))
				.default;
		}
	});
	$: actionItemList = [
		{
			title: userName,
			action: () => undefined,
			icon: 'profile-icon'
		},
		{
			title: 'Reports',
			action: onReportsButtonClick,
			icon: 'reports-icon',
			class: 'cursor-pointer'
		},
		{
			title: 'FAQs',
			action: onFaqsButtonClick,
			icon: 'question-mark-point',
			class: 'cursor-pointer',
			iconWidth: '20',
			iconHeight: '20',
			iconDivClass: 'rounded-full bg-blue-background p-2'
		},
		{
			title: 'Logout',
			action: onLogoutButtonClick,
			icon: 'logout-icon',
			class: 'cursor-pointer'
		}
	];

	const logoUrl = `${base}/images/AngelOneLogo.webp`;
	const activePageTabClass =
		'py-4 hover:text-blue-primary text-blue-primary lg:border-b-2 border-blue-primary';
	const inactivePageTabClass = 'py-4 hover:text-blue-primary lg:border-b-2 border-white';
	$: discoverFundsTabClass = $page.url?.pathname?.includes('/discoverfunds')
		? activePageTabClass
		: $page.url?.pathname?.includes('/explorefunds')
		? activePageTabClass
		: inactivePageTabClass;
	$: myInvestmentsTabClass = $page.url?.pathname?.includes('/investments')
		? activePageTabClass
		: inactivePageTabClass;
	$: ordersTabClass = $page.url?.pathname?.includes('/orders/orderspage')
		? activePageTabClass
		: inactivePageTabClass;
	$: sipsTabClass = $page.url?.pathname?.includes('/sipbook/dashboard')
		? activePageTabClass
		: inactivePageTabClass;
	let isCartActive: boolean;
	$: isCartActive = $page.url?.pathname?.includes('/cart');
	const dispatch = createEventDispatcher();
	const handleSearchFocusEvent = (e: { detail: boolean }) => {
		dispatch('handleSearchFocus', e.detail);
	};
	const onTabClickAnalytics = (label: string) => {
		const eventMetaData = {
			'Tab Name': label
		};
		tabClickNavigationAnalytics(eventMetaData);
	};
</script>

<section class="p-2 pl-4 text-center shadow-clg md:p-5">
	<!-- md and upper (medium and larger) screen layout -->
	<article class="flex-col items-center justify-center gap-10 sm:m-[1px] md:flex md:flex-row">
		<div class="mr-6 cursor-pointer">
			<Link to="/">
				<img src={logoUrl} alt="Angel One Logo" width="127" height="51" />
			</Link>
		</div>
		<Link to="/discoverfunds" on:linkClicked={() => onTabClickAnalytics('Discover Funds')}>
			<div class={`hidden cursor-pointer uppercase md:block ${discoverFundsTabClass}`}>
				Discover
			</div>
		</Link>
		<Link
			to="/investments"
			preloadData={isGuest ? 'off' : 'hover'}
			on:linkClicked={() => onTabClickAnalytics('Investments')}
		>
			<div class={`hidden cursor-pointer uppercase md:block ${myInvestmentsTabClass}`}>
				INVESTMENTS
			</div>
		</Link>
		<Link
			to={`/sipbook/dashboard`}
			preloadData={isGuest ? 'off' : 'hover'}
			on:linkClicked={() => onTabClickAnalytics('SIPS')}
		>
			<div class="mr-4 hidden cursor-pointer uppercase md:block {sipsTabClass}">SIPS</div>
		</Link>
		<Link
			to={`/orders/orderspage`}
			preloadData={isGuest ? 'off' : 'hover'}
			on:linkClicked={() => onTabClickAnalytics('Orders')}
		>
			<div class="mr-4 hidden cursor-pointer uppercase md:block {ordersTabClass}">ORDERS</div>
		</Link>
		<div class="w-full md:w-2/5">
			<svelte:component
				this={SearchDynamicComponent}
				filter="divedendgrowthflag:GROWTH&recommendation=true"
				on:searchFocus={handleSearchFocusEvent}
			/>
			<!-- <SearchComponent  /> -->
		</div>
		<Link
			to="/cart"
			preloadData={isGuest ? 'off' : 'hover'}
			on:linkClicked={() => onTabClickAnalytics('Cart')}
		>
			<div class="relative flex h-9 w-9 items-center justify-center rounded-full bg-grey-light">
				{#if isCartActive}
					<WMSIcon name="cart-filled" />
				{:else}
					<WMSIcon name="cart-outlined" stroke="#3F5BD9" />
				{/if}
				<div
					class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-tulip text-center text-xs font-bold text-white"
				>
					{$cartStore.count}
				</div>
			</div>
		</Link>
		{#if !isGuest}
			<div class="relative">
				<WMSIcon
					name="profile-icon"
					height={36}
					width={36}
					class="cursor-pointer"
					on:click={userActionStore.showUserActionDropDown}
				/>
				{#if $userActionStore.userActionVisible}
					<div>
						<Overlay closeModal={userActionStore.hideUserActionDropDown} isModalOpen />
						<div class="absolute right-0 z-100">
							<Dropdown class="absolute right-0 top-16 z-60" list={actionItemList} />
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</article>
</section>
