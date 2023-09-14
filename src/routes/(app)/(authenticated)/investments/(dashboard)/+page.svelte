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
	import { SEO, WMSIcon } from 'svelte-components';
	import { tabs } from '../constants';
	import OptimisePortfolioCard from './components/OptimisePortfolioCard.svelte';
	import { onMount, tick } from 'svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import type { IOPtimsiePortfolioData, InvestmentEntity } from '$lib/types/IInvestments';
	import {
		fundForYouClickAnalytics,
		fundForYouImpressionAnalytics,
		investmentDashboardImpressionAnalytics,
		switchToDirectClickAnalytics,
		switchToDirectImpressionAnalytics
	} from '../analytics';
	import { regularToDirectFundsStore } from '$lib/stores/RegularToDirectFundStore';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import { ctTrackExternalInvestmentsStore } from '$lib/stores/CtTrackExternalInvestment';
	import Clevertap from '$lib/utils/Clevertap';
	import type { ITab } from '$lib/types/ITab';
	import { getCookie, setCookie } from '$lib/utils/helpers/cookie';

	let isXIRRModalOpen = false;
	let isOptimisePortfolioOpen = false;
	let optimisePorfolioData: IOPtimsiePortfolioData = {
		isin: '',
		schemeCode: '',
		schemeName: '',
		logoUrl: ''
	};
	let holdings: Array<InvestmentEntity>;
	let showTefNudge = true;
	const showXirrModal = () => {
		isXIRRModalOpen = true;
	};

	let cleavertap;
	const toggleOptimisePorfolioCard = () => {
		const investmentSummary = data?.investementSummary;
		fundForYouClickAnalytics({
			'Current Value': investmentSummary?.currentValue,
			'Total Investment': investmentSummary?.investedValue,
			'Overall Gain': `${investmentSummary?.returnsValue}(${investmentSummary?.returnsAbsolutePer}%)`,
			'Todays Loss': `${investmentSummary?.previousDayReturns}(${investmentSummary?.previousDayReturnPercentage}%)`,
			'Fund Name': holdings?.filter((holding) => {
				return {
					'Fund Name': holding?.schemeName,
					'Current Value': holding?.currentValue,
					'Total Investment': holding?.investedValue,
					'Overall Gain': `${holding?.returnsValue}(${holding?.returnsAbsolutePer}%)`
				};
			})
		});
		isOptimisePortfolioOpen = true;
	};

	const switchToDirectFundsImpression = async () => {
		const response = await data.api.investment;
		if (
			$page?.data?.userDetails?.userType?.toUpperCase() === 'B2C' &&
			response?.status === 'success' &&
			Array.isArray(response.data.holdings) &&
			response.data.holdings.length > 0
		) {
			const regularFunds = regularToDirectFundsStore.filterRegularFunds(response.data.holdings);
			if (regularFunds?.length > 0) {
				switchToDirectImpressionAnalytics({
					switchableFunds: regularFunds?.length
				});
			}
		}
	};

	onMount(async () => {
		await tick();
		const investmentSummary = data?.investementSummary;
		const eventMetaData = {
			'Current Value': investmentSummary?.currentValue,
			'Total Investment': investmentSummary?.investedValue,
			'Overall Gain': `${investmentSummary?.returnsValue}(${investmentSummary?.returnsAbsolutePer}%)`,
			'Todays Loss': `${investmentSummary?.previousDayReturns}(${investmentSummary?.previousDayReturnPercentage}%)`,
			Funds: holdings?.filter((holding) => {
				return {
					'Fund Name': holding?.schemeName,
					'Current Value': holding?.currentValue,
					'Total Investment': holding?.investedValue,
					'Overall Gain': `${holding?.returnsValue}(${holding?.returnsAbsolutePer}%)`
				};
			})
		};
		investmentDashboardImpressionAnalytics(eventMetaData);
		switchToDirectFundsImpression();
		const mf_trackext_invdash_type_a = getCookie('mf_trackext_invdash_type_a');
		showTefNudge = mf_trackext_invdash_type_a !== 'false';

		cleavertap = await Clevertap.initialized;
		cleavertap.event.push('MF Inv Dash Internal', {
			event_type: 'impression'
		});
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/recommendation/sip`;
		const res = await useFetch(url, {}, fetch);
		if (res?.ok && res?.status === 200) {
			optimisePorfolioData = res?.data?.recommendedScheme?.[0] || {};
			if (
				optimisePorfolioData?.schemeCode &&
				optimisePorfolioData?.schemeName &&
				optimisePorfolioData?.isin
			) {
				fundForYouImpressionAnalytics({
					...eventMetaData
				});
			}
		}
	});

	$: isMobile = $page?.data?.deviceType?.isMobile;

	let activeTab: string;
	$: activeTab =
		new Map($page.url.searchParams)?.get('type')?.toLocaleLowerCase() ||
		(data?.isExternal ? 'all' : 'Angel One');

	const navigateToSwitchToDirectFunds = async (regularFunds) => {
		regularToDirectFundsStore.populateRegularFunds(regularFunds, false);
		switchToDirectClickAnalytics({
			switchableFunds: regularFunds?.length
		});
		await goto(`${base}/investments/RegularToDirect`);
	};

	const navigateToTef = () => {
		const tefTab: ITab[] = tabs.filter((tab) => tab.name === 'All');
		tefTab[0]?.onClick();
	};

	const hideTefNudge = () => {
		showTefNudge = false;
		setCookie('mf_trackext_invdash_type_a', 'false', {
			maxAge: 2592000,
			secure: true,
			sameSite: 'Strict'
		});
	};
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
					bind:holdings
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
		{#await data.api.investment then response}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			{#if $page?.data?.userDetails?.userType?.toUpperCase() === 'B2C' && response?.status === 'success' && Array.isArray(response.data.holdings) && response.data.holdings.length > 0}
				{@const regularFunds = regularToDirectFundsStore.filterRegularFunds(response.data.holdings)}
				{#if regularFunds?.length > 0}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="flex flex-row items-center justify-between rounded-lg bg-purple-light p-3 sm:mt-4"
						on:click={() => navigateToSwitchToDirectFunds(regularFunds)}
					>
						<div class="mr-4 flex flex-row items-center">
							<WMSIcon name="switch-fund" class="mr-2 h-9 w-9 min-w-[36px]" />
							<div>
								<div class="text-xs font-bold text-black-title">Earn up to 1.5% More Returns</div>
								<div class="text-xs text-black-title">
									Switch {regularFunds?.length} mutual funds in your portfolio to
									<span class="font-bold">zero commission plans</span> and earn more returns
								</div>
							</div>
						</div>
						<WMSIcon name="right-arrow" class="h-6 w-6 min-w-[24px]" stroke="#3F5BD9" />
					</div>
				{/if}
			{/if}
		{/await}
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

	{#if $ctTrackExternalInvestmentsStore?.subtext && showTefNudge}
		<aside class="fixed bottom-20 -ml-2 flex w-full items-center bg-purple-glow p-3 align-middle">
			<div>
				<WMSIcon name="import-external-funds" />
			</div>
			<p class="text-xs">
				{$ctTrackExternalInvestmentsStore?.subtext}
			</p>
			<Button variant="transparent" class="ml-auto text-xs !uppercase" onClick={navigateToTef}>
				{$ctTrackExternalInvestmentsStore?.ctatext}
			</Button>
			<Button variant="transparent" onClick={hideTefNudge}>
				<WMSIcon name="cross-circle" width={24} height={24} />
			</Button>
		</aside>
	{/if}
{/if}
