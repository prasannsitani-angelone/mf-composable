<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import Link from './Link.svelte';
	import type { Breadcrumbs } from '../types/IBreadcrumbs';

	export let items: Array<Breadcrumbs>;

	let breadCrumbsList: Array<Breadcrumbs>;
	$: breadCrumbsList = items?.map((breadCrumb) => {
		if ($page.url.pathname === base + breadCrumb.href) {
			breadCrumb.disabled = true;
			breadCrumb.isLast = true;
		}

		return breadCrumb;
	});
</script>

<nav class={$$props.class}>
	<ol class="flex">
		{#each breadCrumbsList as crumb, index (crumb.text)}
			<li class="mr-1 flex items-center justify-center" class:pointer-events-none={crumb.disabled}>
				{#if crumb.text?.toLowerCase() === 'home'}
					<Link
						to="/discoverfunds"
						class="text-sm text-grey-body {crumb.isLast ? 'font-normal' : ''}">{crumb.text}</Link
					>
				{:else}
					<Link to={crumb.href} class="text-sm text-grey-body {crumb.isLast ? 'font-normal' : ''}">
						{crumb.text}
					</Link>
				{/if}

				{#if index < breadCrumbsList.length - 1}
					<RightIcon class="mt-1 stroke-current" />
				{/if}
			</li>
		{/each}
	</ol>
</nav>
