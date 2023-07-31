<script lang="ts">
	import { page } from '$app/stores';
	import YourInvestmentsNew from './YourInvestmentsNew.svelte';
	import ReportsSection from './ReportsSection.svelte';
	import NoOrders from '$components/NoOrders.svelte';
	import PortfolioCardInvestment from '$components/PortfolioCards/PortfolioCardInvestment.svelte';
	import InvestmentOrders from './InvestmentOrders.svelte';
	import ExternalInvestments from './ExternalInvestments.svelte';
	import Link from '$components/Link.svelte';
	import InvestmentDashboardLoader from './Loaders/InvestmentDashboardLoader.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import ErrorLoadingComponent from '$components/ErrorLoadingComponent.svelte';

	import TrendingFunds from '$components/TrendingFunds/TrendingFunds.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	import InvestmentTab from './components/InvestmentTab.svelte';
	import { SEO } from 'svelte-components';
	import { tabs } from '../constants';
	import OptimisePortfolioCard from './components/OptimisePortfolioCard.svelte';
	import { onMount, tick } from 'svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import type { IOPtimsiePortfolioData } from '$lib/types/IInvestments';

	let isXIRRModalOpen = false;
	let isOptimisePortfolioOpen = false;
	let optimisePorfolioData: IOPtimsiePortfolioData = {
		isin: '',
		schemeCode: '',
		schemeName: '',
		logoUrl: ''
	};

	const showXirrModal = () => {
		isXIRRModalOpen = true;
	};

	const toggleOptimisePorfolioCard = () => {
		isOptimisePortfolioOpen = true;
	};

	onMount(async () => {
		await tick();
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/recommendation/sip`;
		const res = await useFetch(url, {}, fetch);
		if (res?.ok && res?.status === 200) {
			optimisePorfolioData = res?.data?.recommendedScheme?.[0] || {};
		}
	});

	$: isMobile = $page?.data?.deviceType?.isMobile;

	let activeTab: string;
	$: activeTab = new Map($page.url.searchParams)?.get('type')?.toLocaleLowerCase() || 'Angel One';
</script>

<SEO
	seoTitle="Your Mutual Funds Investment | Angel One"
	seoDescription="Get Access to your Mutual Funds investment here. Check and enhance mutual funds investment portfolio better with Angel One."
/>
<section class="col-span-1 row-span-1 row-start-1 hidden sm:col-span-1 sm:col-start-1 sm:block">
	<InvestmentTab {activeTab} {tabs} class=" shadow-csm" />
</section>
{#if activeTab === 'all'}
	<ExternalInvestments {data} />
{:else}
	<section class="col-span-1 row-start-3 sm:col-span-1 sm:col-start-1 sm:row-start-2">
		{#await data.api.investment}
			<InvestmentDashboardLoader />
		{:then response}
			{#if response && response.status === 'success' && Array.isArray(response.data.holdings) && response.data.holdings.length > 0}
				<!-- Show Users investment if exist -->
				<YourInvestmentsNew
					investmentSummary={data.investementSummary}
					{optimisePorfolioData}
					tableData={response.data?.holdings || []}
					bind:isXIRRModalOpen
					bind:isOptimisePortfolioOpen
				/>
			{:else}
				<!-- Show No orders component and TendingFunds Table in case user investment does not exist or not processed -->
				<article class="mt-2 hidden max-w-4xl rounded-lg bg-white text-sm shadow-csm md:block">
					<NoOrders
						title="Your investments will show up here. Explore funds and place an order to get started"
					/>
				</article>
				{#if data?.searchDashboardData?.weeklyTopSchemes}
					<TrendingFunds
						tableData={data.searchDashboardData.weeklyTopSchemes}
						title="Popular Funds"
						classes={{ container: '!pb-0 mb-4', header: 'max-sm:pb-0' }}
					>
						<svelte:fragment slot="footer">
							<footer class="mt-3 border-t border-grey-line py-5">
								<div
									class=" flex cursor-pointer items-center justify-center text-sm font-semibold uppercase text-blue-primary"
								>
									<Link
										to={`/explorefunds/${data.searchDashboardData.searchOptions[0]?.name
											?.split(' ')
											.join('-')
											.toLowerCase()}?id=${data.searchDashboardData.searchOptions[0]?.id || ''}`}
										class="flex items-center"
									>
										<span class="uppercase">explore funds</span>
										<RightIcon class="ml-2" stroke="#3F5BD9" />
									</Link>
								</div>
							</footer>
						</svelte:fragment>
					</TrendingFunds>
				{/if}
			{/if}
		{:catch error}
			<div>
				<ErrorLoadingComponent
					title="Error Fetching Investments"
					message="We could not fetch your investment list due to a technical error. Please try again"
				/>
			</div>
		{/await}
		{#if isMobile}
			<ReportsSection />
		{/if}
	</section>

	<!-- Right Side Contents -->
	<section class="col-span-1 row-start-1 sm:col-span-1 sm:col-start-2 sm:row-span-3">
		<section class="sm:sticky sm:top-0">
			<!-- Portfolio cards: All scenarios -->
			<article class="mb-2 overflow-hidden sm:mb-0">
				<PortfolioCardInvestment
					onInfoClick={showXirrModal}
					investmentSummary={data.investementSummary}
				/>
			</article>
			{#if optimisePorfolioData?.schemeCode && optimisePorfolioData?.schemeName && optimisePorfolioData?.isin}
				<article class="mt-2 hidden sm:block">
					<OptimisePortfolioCard on:click={toggleOptimisePorfolioCard} />
				</article>
			{/if}
			<!-- Order cards: Visible only in desktop and tablet -->
			{#if !isMobile}
				<article class="mt-5">
					<InvestmentOrders />
				</article>
			{/if}
		</section>
	</section>
{/if}
