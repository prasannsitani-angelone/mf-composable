<script lang="ts">
	import NFOTable from './NFOTable.svelte';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import type { PageData } from './$types';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import { SEO } from 'svelte-components';

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
<header class="hidden sm:block">
	<h2 class="mb-6 mt-1 text-lg font-normal text-black-title">Open NFO’s</h2>
</header>
<div />
{#await data.api.nfo}
	<TableSkeleton />
{:then nfo}
	<NFOTable searchOption={nfo} />
{:catch error}
	<!-- promise was rejected -->
{/await}
