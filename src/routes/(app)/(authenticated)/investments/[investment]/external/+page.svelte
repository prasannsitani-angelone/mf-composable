<script lang="ts">
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/UserStore';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import LeftSideView from '../LeftSideView.svelte';
	import InvestmentDetailsLoader from '../components/InvestmentDetailsLoader.svelte';
	import type { PageData } from '../$types';
	import type { FolioHoldingType, ChartData, OrdersData } from '$lib/types/IInvestments';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import { SEO } from 'svelte-components';

	export let data: PageData;

	interface BreadcrumbType {
		text: string;
		href: string;
	}
	let breadCrumbs: BreadcrumbType[];
	$: breadCrumbs = [];
	$: holdingsData = <FolioHoldingType>{};

	let isInvestmentNotAllowed = false;

	async function setPageData(
		data: Promise<{
			holdingsData: FolioHoldingType;
			chartData: ChartData;
			ordersData: OrdersData;
			schemeData: SchemeDetails;
		}>
	) {
		const result = await data;

		breadCrumbs = [
			{
				text: 'Home',
				href: '/'
			},
			{
				text: 'Your Investments',
				href: '/investments?type=all'
			},
			{
				text: `${result?.holdingsData?.schemeName}`,
				href: `/investments/${normalizeFundName(
					result?.holdingsData?.schemeName,
					result?.holdingsData?.isin,
					result?.holdingsData?.schemeCode
				)}/external`
			}
		];

		holdingsData = result?.holdingsData;

		isInvestmentNotAllowed = !isInvestmentAllowed(userStore?.userType(), holdingsData?.schemePlan);
	}

	$: {
		setPageData(data.api?.allResponse);
	}

	const handleErrorNavigation = () => goto('/');
</script>

<SEO
	seoTitle="Mutual Fund External Investment Analysis | Angel One"
	seoDescription="Get your mutual fund external investment"
/>
{#await data.api.allResponse}
	<InvestmentDetailsLoader />
{:then res}
	{#if res.holdingsData && Object.keys(res.holdingsData)?.length > 0}
		<!-- Left Side -->
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />

			<!-- Investment Details Page (Mobile and Desktop Layout) -->
			<LeftSideView
				holdings={res.holdingsData}
				chartData={res.chartData}
				ordersData={res.ordersData}
				schemeDetails={res.schemeData}
			/>
		</section>
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
