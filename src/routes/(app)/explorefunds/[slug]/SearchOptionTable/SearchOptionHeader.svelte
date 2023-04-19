<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	import Button from '$components/Button.svelte';
	import Link from '$components/Link.svelte';
	import type { ExploreFundNavItem } from '../../types';

	let exploreFundsNavigation: ExploreFundNavItem[];

	export { exploreFundsNavigation };
</script>

<section class="scrollbar-hide flex w-full gap-2 overflow-x-scroll">
	{#each exploreFundsNavigation as nav}
		{@const isActive = `${$page.url.pathname}${$page.url.search}` === `${base}${nav.href}`}
		<Link to={nav.href}>
			<Button
				variant={isActive ? 'contained' : 'outlined'}
				class={`${isActive ? '' : '!border-grey-line !font-medium !text-grey-body'}`}
			>
				{nav.title}
			</Button>
		</Link>
	{/each}
</section>
