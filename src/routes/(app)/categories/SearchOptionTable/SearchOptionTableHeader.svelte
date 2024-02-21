<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	import Link from '$components/Link.svelte';
	import { onMount } from 'svelte';
	import type { CategoryNavItem, CategoryDetailsModalData } from '../types';
	import { sExploreMutualFunds } from '../../explorefunds/[slug]/analytics';

	let categoryFilterOptions: CategoryNavItem[];
	let pageID: string;
	const activeLink = 'text-background-alt bg-primary';
	const inActiveLink = ' text-body bg-background-alt';
	let categoryDetails: CategoryDetailsModalData;

	const setScrollPosition = () => {
		const currentLink = document.getElementById(`filter-${pageID}`);
		currentLink?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
	};

	const handleLinkClick = (nav: CategoryNavItem) => {
		setTimeout(() => {
			setScrollPosition();
		}, 66);
		sExploreMutualFunds({ Category: nav.title, type: 'click' });
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
	export { categoryFilterOptions, categoryDetails, pageID };
</script>

<section class="scrollbar-hide flex w-full gap-2 overflow-x-scroll px-3 pt-3 md:px-0">
	{#each categoryFilterOptions as nav (nav?.id)}
		{@const isActive =
			`${$page.url.pathname}?id=${$page.url.searchParams.get('id')}` === `${base}${nav.href}`}
		<Link
			to={nav.href}
			class={`cursor-pointer whitespace-nowrap rounded border ${
				isActive ? activeLink : inActiveLink
			}`}
			on:linkClicked={() => handleLinkClick(nav)}
			id="filter-{nav.id}"
			replaceState={true}
		>
			<h2 class="px-4 py-2 text-center text-xs font-normal">{nav.title}</h2>
		</Link>
	{/each}
</section>
{#if categoryDetails?.shortDescription}
	<p class="mx-3 my-3 text-sm font-normal text-title">{categoryDetails?.shortDescription}</p>
	<ul class="mx-6">
		{#each categoryDetails?.detailedDescription || [] as description}
			<li class="mb-1 list-disc text-xs font-normal text-title">
				{description}
			</li>
		{/each}
	</ul>
{/if}
