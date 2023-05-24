<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';

	import Link from '$components/Link.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import TaxSavingIcon from '$lib/images/icons/TaxSavingIcon.svelte';
	import type { ExploreFundNavItem, ExploreModalData } from '../../types';
	import { exploreMFFilter } from '../analytics';

	let exploreFundsNavigation: ExploreFundNavItem[];
	let toggleTaxSavingModal: (() => void) | null = null;
	const activeLink = 'text-white bg-blue-primary';
	const inActiveLink = 'border-grey-line  text-grey-body bg-white';
	let modalList: ExploreModalData;
	export { exploreFundsNavigation, toggleTaxSavingModal, modalList };
</script>

<section class="scrollbar-hide flex w-full gap-2 overflow-x-scroll sm:pt-3">
	{#each exploreFundsNavigation as nav}
		{@const isActive = `${$page.url.pathname}${$page.url.search}` === `${base}${nav.href}`}
		<Link
			to={nav.href}
			class={`w-28 cursor-pointer rounded border ${isActive ? activeLink : inActiveLink}`}
			on:linkClicked={() => {
				exploreMFFilter(nav.title);
			}}
			replaceState={true}
		>
			<h2 class="w-28 px-4 py-3 text-center text-xs font-medium">{nav.title}</h2>
		</Link>
	{/each}
</section>
{#if modalList?.shortDescription}
	<Button variant="transparent" class="no-animation w-full px-0" onClick={toggleTaxSavingModal}>
		<aside class="mt-5 flex w-full cursor-pointer items-center rounded bg-grey px-5 py-3">
			<TaxSavingIcon />
			<span class="ml-3 text-sm font-medium text-black-title">{modalList?.shortDescription}</span>
			<RightIcon class="ml-auto" />
		</aside>
	</Button>
{/if}
