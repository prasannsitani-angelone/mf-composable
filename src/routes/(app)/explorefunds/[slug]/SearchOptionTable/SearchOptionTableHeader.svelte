<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	import Link from '$components/Link.svelte';
	import type { ExploreFundNavItem } from '../../types';

	let exploreFundsNavigation: ExploreFundNavItem[];

	const activeLink = 'text-white bg-blue-primary';
	const inActiveLink = 'border-grey-line  text-grey-body bg-white';

	export { exploreFundsNavigation };
</script>

<section class="scrollbar-hide flex w-full gap-2 overflow-x-scroll">
	{#each exploreFundsNavigation as nav}
		{@const isActive = `${$page.url.pathname}${$page.url.search}` === `${base}${nav.href}`}
		<Link
			to={nav.href}
			class={`w-28 cursor-pointer rounded border ${isActive ? activeLink : inActiveLink}`}
		>
			<h2 class="w-28 px-4 py-3 text-center text-xs font-medium">{nav.title}</h2>
		</Link>
	{/each}
</section>
