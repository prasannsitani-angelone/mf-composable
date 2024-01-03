<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import { SEO } from 'svelte-components';
	import type { PageData } from './$types';
	import ActiveNfo from './components/ActiveNFO.svelte';
	import ClosedNfo from './components/ClosedNFO.svelte';

	const breadCrumbs = [
		{
			text: 'Home',
			href: '/discoverfunds'
		},
		{
			text: 'NFO',
			href: '/nfo'
		}
	];
	export let data: PageData;
</script>

<SEO seoTitle="New Fund Offering, NFO | Angelone" seoDescription="New Fund Offering, NFO" />

<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />

{#await data.api.nfo}
	<TableSkeleton />
{:then nfo}
	{#if nfo?.length > 0}
		<ActiveNfo {nfo} />
	{:else}
		{#await data.api.closedNfo}
			<TableSkeleton />
		{:then closedNfo}
			<ClosedNfo {closedNfo} />
		{/await}
	{/if}
{/await}
