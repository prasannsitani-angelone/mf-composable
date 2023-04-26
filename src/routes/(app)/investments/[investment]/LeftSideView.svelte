<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import HoldingsOverview from '../portfolio/HoldingsOverview.svelte';
	import FolioSummary from './FolioSummary.svelte';
	import TransactionHistory from './TransactionHistory.svelte';
	import type { FolioHoldingType, ChartData, OrdersData } from '$lib/types/IInvestments';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	export let holdings: FolioHoldingType;
	export let chartData: ChartData;
	export let ordersData: OrdersData;
	export let schemeDetails: SchemeDetails;

	const userType = $page.data?.profile?.userType || '';

	$: isInvestmentNotAllowed = !isInvestmentAllowed(userType, holdings?.schemePlan);

	const handleSchemeCardClick = () => {
		if (isInvestmentNotAllowed) {
			return;
		}
		// TODO: Analytics
		// fundCardClickAnalyticsFunc();

		goto(
			`../schemes/${normalizeFundName(holdings?.schemeName, holdings?.isin, holdings?.schemeCode)}`
		);
	};
</script>

<section>
	<article>
		<ResultItem
			class={`mb-2 rounded-lg bg-white p-4 shadow-csm md:px-6 md:py-5 ${
				!isInvestmentNotAllowed && schemeDetails ? 'cursor-pointer' : ''
			}`}
			data={schemeDetails}
			schemeName={holdings?.schemeName}
			logoUrl={holdings?.logoUrl}
			categoryName={holdings?.schemePlan}
			subcategoryName={holdings?.sipEnabled ? 'SIP' : 'ONE-TIME'}
			titleStyle="ml-1 text-sm lg:text-lg font-medium text-black-title"
			categoryStyle="mx-1 font-medium"
			subCategoryStyle="ml-1 font-medium"
			on:click={handleSchemeCardClick}
		>
			<svelte.fragment slot="ratingSection">
				<span />
			</svelte.fragment>
			<svelte.fragment slot="returns">
				{#if !isInvestmentNotAllowed && schemeDetails}
					<span>
						<RightIcon />
					</span>
				{/if}
			</svelte.fragment>
		</ResultItem>
	</article>
	<HoldingsOverview folioSummary={holdings} chartDataList={chartData.chart} showGraphTags={false} />
	<FolioSummary folioDetails={holdings} />
	<TransactionHistory
		transactionList={ordersData.orders}
		class={isInvestmentNotAllowed ? 'mb-36' : ''}
	/>
	<!-- TODO: Add the complete class condition for TransactionHistory - (isInvestmentNotAllowed || withdrawDisableText?.length) && 'mb-36' -->
</section>
