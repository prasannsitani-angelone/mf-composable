<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import Link from '../Link.svelte';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import { getContext } from 'svelte';
	import type { AppContext } from '$lib/types/IAppContext';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import SearchComponent from '$lib/components/Search/SearchComponent.svelte';
	import { OnNavigation } from '$lib/utils/navigation';
	import { WMSIcon } from 'wms-ui-component';
	import Overlay from '$components/Modal.svelte';
	import Dropdown from '$components/Dropdown.svelte';
	import { userActionStore } from '$lib/stores/UserActionStore';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';
	import { reportsEntryDesktopAnalytics } from '$lib/analytics/reports/reports';

	const onReportsButtonClick = () => {
		userActionStore.hideUserActionDropDown();
		reportsEntryDesktopAnalytics();
		goto(`${base}/reports`);
	};

	const onLogoutButtonClick = () => {
		userActionStore.hideUserActionDropDown();
		logoutAttemptStore.showLogoutConfirmationPopup();
	};

	$: isGuest = $page.data?.isGuest;
	$: userName = $page.data?.profile?.clientDetails?.fullName || '';

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
	const discoverFundsTabClass = $page.url?.pathname?.includes('/discoverfunds')
		? activePageTabClass
		: $page.url?.pathname?.includes('/explorefunds')
		? activePageTabClass
		: inactivePageTabClass;
	const myInvestmentsTabClass = $page.url?.pathname?.includes('/investments')
		? activePageTabClass
		: inactivePageTabClass;
	const ordersTabClass = $page.url?.pathname?.includes('/orders/orderspage')
		? activePageTabClass
		: inactivePageTabClass;
	const isFavouritesActive = $page.url?.pathname?.includes('/favourites');
	const appContext: AppContext = getContext('app');
	const dispatch = createEventDispatcher();
	const handleSearchFocusEvent = (e: { detail: boolean }) => {
		dispatch('handleSearchFocus', e.detail);
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
		<Link
			to={`${getNavigationBaseUrl('', appContext.scheme, appContext.host)}/discoverfunds`}
			on:linkClicked={OnNavigation}
		>
			<div class={`hidden cursor-pointer uppercase md:block ${discoverFundsTabClass}`}>
				Discover
			</div>
		</Link>
		<Link to="/investments">
			<div class={`hidden cursor-pointer uppercase md:block ${myInvestmentsTabClass}`}>
				INVESTMENTS
			</div>
		</Link>
		<Link to={`/orders/orderspage`}>
			<div class="mr-4 hidden cursor-pointer uppercase md:block {ordersTabClass}">ORDERS</div>
		</Link>
		<div class="w-full md:w-2/5">
			<SearchComponent on:searchFocus={handleSearchFocusEvent} />
		</div>
		<Link to="/favourites">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-full {isFavouritesActive
					? 'bg-blue-primary'
					: 'bg-grey-light'}"
			>
				<WMSIcon name="bookmark" size="lg" mode={isFavouritesActive ? 'white' : 'blue'} />
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
