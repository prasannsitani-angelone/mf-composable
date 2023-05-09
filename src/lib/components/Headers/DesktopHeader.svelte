<script lang="ts">
	import { base } from '$app/paths';
	import Link from '../Link.svelte';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import { getContext } from 'svelte';
	import type { AppContext } from '$lib/types/IAppContext';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import SearchComponent from '$lib/components/Search/SearchComponent.svelte';
	import { OnNavigation } from '$lib/utils/navigation';

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
		<Link to="/investments" on:linkClicked={OnNavigation}>
			<div class={`mr-4 hidden cursor-pointer uppercase md:block ${myInvestmentsTabClass}`}>
				INVESTMENTS
			</div>
		</Link>
		<div class="w-full md:w-2/5">
			<SearchComponent on:searchFocus={handleSearchFocusEvent} />
		</div>
	</article>
</section>
