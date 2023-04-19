<script lang="ts">
	import { goto } from '$app/navigation';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import LeftSideView from './LeftSideView.svelte';
	import InvestmentPad from '../../InvestmentPad/InvestmentPad.svelte';
	import type { PageData } from '../$types';

	export let data: PageData;
	$: holdingsData = data.api?.holdingsData || {};
	$: chartData = Object.keys(data.api?.chartData).length > 0 ? data.api?.chartData : { chart: [] };
	$: ordersData =
		Object.keys(data.api?.ordersData).length > 0 ? data.api?.ordersData : { orders: [] };
	$: schemeData = data?.api?.schemeData || {};

	$: breadCrumbs = [
		{
			text: 'Home',
			href: '/'
		},
		{
			text: 'Your Investments',
			href: '/investments'
		},
		{
			text: `${holdingsData?.schemeName}`,
			href: `/investments/${normalizeFundName(
				holdingsData?.schemeName,
				holdingsData?.isin,
				holdingsData?.schemeCode
			)}`
		}
	];

	const handleErrorNavigation = () => goto('/');
</script>

{#await data.api?.holdingsData}
	<div>Loading ............</div>
{:then holdingsData}
	{#if holdingsData && Object.keys(holdingsData)?.length > 0}
		<!-- Left Side -->
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />

			<LeftSideView holdings={holdingsData} {chartData} {ordersData} schemeDetails={schemeData} />
		</section>

		<!-- Right Side -->
		<article class="rounded-lg bg-white text-black-title">
			<!-- <InvestmentPad {schemeData} fromInvestmentDetailsPage /> -->
		</article>
	{:else}
		<section class="col-span-full">
			<ErrorView
				Icon={PortfolioEmptyIcon}
				heading="No Investment Found"
				contentLine="You have not invested in this fund currently. Explore mutual funds to start a new investment"
				textForButton="EXPLORE MUTUAL FUNDS"
				handleCTAClick={handleErrorNavigation}
			/>
		</section>
	{/if}
{/await}
