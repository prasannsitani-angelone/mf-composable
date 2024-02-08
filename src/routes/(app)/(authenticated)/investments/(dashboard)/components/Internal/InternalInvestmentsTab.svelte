<script lang="ts">
	import NoOrders from '$components/NoOrders.svelte';
	import TrendingFunds from '$components/TrendingFunds/TrendingFunds.svelte';
	import type { IOPtimsiePortfolioData, InvestmentEntity } from '$lib/types/IInvestments';
	import type { PageData } from '../../$types';
	import { fundForYouClickAnalytics, switchToDirectClickAnalytics } from '../../../analytics';
	import InvestmentDashboardLoader from '../../Loaders/InvestmentDashboardLoader.svelte';
	import YourInvestmentsNew from '../../YourInvestmentsNew.svelte';
	import Link from '$components/Link.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import ErrorLoadingComponent from '$components/ErrorLoadingComponent.svelte';
	import ReportsSection from '../../ReportsSection.svelte';
	import { page } from '$app/stores';
	import { WMSIcon } from 'svelte-components';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { regularToDirectFundsStore } from '$lib/stores/RegularToDirectFundStore';
	import ClevertapNudgeComponent from '$components/clevertap/ClevertapNudgeComponent.svelte';
	import { ctNudgeStore } from '$lib/stores/CtNudgeStore';
	import InternalRightSide from './InternalRightSide.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Clevertap from '$lib/utils/Clevertap';
	import { debounce } from '$lib/utils/helpers/debounce';
	import SomethingWentWrongSmall from '$components/Error/SomethingWentWrongSmall.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { appStore } from '$lib/stores/SparkStore';
	import { profileStore } from '$lib/stores/ProfileStore';

	export let data: PageData;
	let isFamilyPortfolio = false;

	let selfClientId = profileStore?.clientId();
	let selfClientIdInterval: ReturnType<typeof setInterval>;
	let familyPortfolioHoldings;

	let isXIRRModalOpen = false;
	let isOptimisePortfolioOpen = false;
	let optimisePorfolioData: IOPtimsiePortfolioData = {
		isin: '',
		schemeCode: '',
		schemeName: '',
		logoUrl: ''
	};
	let holdings: Array<InvestmentEntity>;
	let cleavertap;
	$: isMobile = $page?.data?.deviceType?.isMobile;

	const showXirrModal = () => {
		isXIRRModalOpen = true;
	};
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
	const navigateToSwitchToDirectFunds = async (regularFunds) => {
		regularToDirectFundsStore.populateRegularFunds(regularFunds, false);
		switchToDirectClickAnalytics({
			switchableFunds: regularFunds?.length
		});
		await goto(`${base}/investments/RegularToDirect`);
	};
	const initializeClevertapData = debounce(async () => {
		cleavertap = await Clevertap.initialized;
		cleavertap.event.push('MF Inv Dash Internal', {
			event_type: 'impression'
		});
	});

	let isFamilyPortfolioDataFetched = false;

	const getFamilyPortfolioHoldings = async () => {
		isFamilyPortfolioDataFetched = false;
		const query = appStore?.getSelectedLinkedMembersQuery();
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings`;
		const res = await useFetch(
			url,
			{
				headers: {
					'X-FOR-MEMBER': query
				}
			},
			fetch
		);
		if (res?.ok) {
			familyPortfolioHoldings = res?.data?.data?.holdings;
		}
		isFamilyPortfolioDataFetched = true;
	};

	const setFamilyPortfolioData = () => {
		selfClientIdInterval = setInterval(() => {
			selfClientId = profileStore?.clientId();

			if (selfClientId?.length) {
				isFamilyPortfolio = appStore?.isFamilyPortfolioSelected(selfClientId);
				getFamilyPortfolioHoldings();
				clearInterval(selfClientIdInterval);
			}
		}, 100);
	};

	const handleFamilyPortfolioData = () => {
		if (selfClientId?.length) {
			isFamilyPortfolio = appStore?.isFamilyPortfolioSelected(selfClientId);
			getFamilyPortfolioHoldings();
		} else {
			setFamilyPortfolioData();
		}
	};

	onMount(() => {
		handleFamilyPortfolioData();
		initializeClevertapData();

		return () => {
			if (selfClientIdInterval !== undefined) {
				clearInterval(selfClientIdInterval);
			}
		};
	});
	onDestroy(() => {
		initializeClevertapData.cancel();
	});
</script>

<div class="px-2 py-2 md:p-0">
	<section class="col-span-1 row-start-3 mb-32 sm:col-span-1 sm:col-start-1 sm:row-start-2">
		{#await data.api.investment}
			<InvestmentDashboardLoader />
		{:then response}
			{#if response instanceof Error}
				<SomethingWentWrongSmall class="!mt-0 shadow-none md:mt-2" />
			{:else if response && response.status === 'success' && Array.isArray(response.data.holdings) && response.data.holdings.length > 0}
				<!-- Show Users investment if exist -->
				{#if isMobile}
					<InternalRightSide
						{data}
						on:showXirr={showXirrModal}
						on:openOptimisePortfolio={toggleOptimisePorfolioCard}
					/>
				{/if}
				{#if isFamilyPortfolio && !isFamilyPortfolioDataFetched}
					<InvestmentDashboardLoader />
				{:else}
					<YourInvestmentsNew
						investmentSummary={isFamilyPortfolio ? {} : data.investementSummary}
						{optimisePorfolioData}
						tableData={isFamilyPortfolio
							? familyPortfolioHoldings || []
							: response.data?.holdings || []}
						bind:holdings
						bind:isXIRRModalOpen
						bind:isOptimisePortfolioOpen
					/>
				{/if}
			{:else}
				<!-- Show No orders component and TendingFunds Table in case user investment does not exist or not processed -->
				<article
					class="mt-2 hidden max-w-4xl rounded-lg bg-background-alt text-sm shadow-csm md:block"
				>
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
							<footer class="mt-3 border-t py-5">
								<div
									class=" flex cursor-pointer items-center justify-center text-sm font-medium uppercase text-primary"
								>
									<Link to={`/explorefunds/high-returns?id=19`} class="flex items-center">
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
						class="flex flex-row items-center justify-between rounded-lg bg-tint12-secondary-alt p-3 sm:mt-4"
						on:click={() => navigateToSwitchToDirectFunds(regularFunds)}
					>
						<div class="mr-4 flex flex-row items-center">
							<WMSIcon name="switch-fund" class="mr-2 h-9 w-9 min-w-[36px]" />
							<div>
								<div class="text-xs font-bold text-title">Earn up to 1.5% More Returns</div>
								<div class="text-xs text-title">
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
</div>

{#if ['mf_invdash_bottomsticky_type_b', 'mf_invdash_bottomsticky_type_c', 'mf_invdash_bottomsticky_type_d'].includes($ctNudgeStore?.kv?.topic) && isMobile}
	<ClevertapNudgeComponent
		class="fixed bottom-18 -ml-2 flex w-full items-center align-middle"
		data={$ctNudgeStore}
		on:onCTAClicked={(e) => goto(e.detail.url)}
	/>
{/if}
