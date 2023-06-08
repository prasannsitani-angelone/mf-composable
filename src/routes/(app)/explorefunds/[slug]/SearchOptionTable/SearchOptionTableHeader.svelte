<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';

	import Link from '$components/Link.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import TaxSavingIcon from '$lib/images/icons/TaxSavingIcon.svelte';
	import { onMount } from 'svelte';
	import type { ExploreFundNavItem, ExploreModalData } from '../../types';
	import { exploreMFFilter } from '../analytics';

	let exploreFundsNavigation: ExploreFundNavItem[];
	let toggleTaxSavingModal: (() => void) | null = null;
	let pageID: string;
	const activeLink = 'text-white bg-blue-primary';
	const inActiveLink = 'border-grey-line  text-grey-body bg-white';
	let modalList: ExploreModalData;

	const setScrollPosition = () => {
		const currentLink = document.getElementById(`filter-${pageID}`);
		currentLink?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
	};
	onMount(() => {
		// Defer scroll till the DOM is ready, requestIdleCallback not supported in Safari
		if (typeof window.requestIdleCallback === 'function') {
			requestIdleCallback(() => {
				setScrollPosition();
			});
		} else {
			setTimeout(() => {
				setScrollPosition();
			}, 66);
		}
	});
	export { exploreFundsNavigation, toggleTaxSavingModal, modalList, pageID };
</script>

<section class="scrollbar-hide flex w-full gap-2 overflow-x-scroll sm:pt-3">
	{#each exploreFundsNavigation as nav}
		{@const isActive =
			`${$page.url.pathname}?id=${$page.url.searchParams.get('id')}` === `${base}${nav.href}`}
		<Link
			to={nav.href}
			class={`w-28 cursor-pointer rounded border ${isActive ? activeLink : inActiveLink}`}
			on:linkClicked={() => {
				exploreMFFilter(nav.title);
			}}
			id="filter-{nav.id}"
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
