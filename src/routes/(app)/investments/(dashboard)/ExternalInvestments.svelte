<script lang="ts">
	import YourInvestments from './YourInvestments.svelte';
	import InvestmentDashboardLoader from './Loaders/InvestmentDashboardLoader.svelte';
	import PortfolioCardLoader from '$components/PortfolioCards/PortfolioCardLoader.svelte';
	import ExternalFundsPortfolioCard from '$components/PortfolioCards/ExternalFundsPortfolioCard.svelte';
	import ExternalFundsNoData from '$components/PortfolioCards/ExternalFundsNoData.svelte';
	import FetchFundsFlowModal from './components/FetchFundsFlowModal.svelte';
	import FirstTimeImport from './components/FirstTimeImport.svelte';
	import RefreshFunds from './components/RefreshFunds.svelte';
	import RefreshErrorModal from './components/RefreshErrorModal.svelte';
	import ErrorFetchingInvestments from './components/ErrorFetchingInvestments.svelte';
	import FetchingInprogress from './components/FetchingInprogress.svelte';
	import NoInvestmentFound from './components/NoInvestmentFound.svelte';
	import FirstTimeInfoCard from './components/FirstTimeInfoCard.svelte';
	import ErrorLoadingTableData from './components/ErrorLoadingTableData.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { getTimestampHoursDifference } from '$lib/utils/helpers/date';

	import type { PageData } from './$types';
	import type {
		InvestmentSummary,
		InvestmentEntity,
		SummaryPromise,
		HoldingsPromise
	} from '$lib/types/IInvestments';

	export let data: PageData;

	$: isExternal = data?.isExternal;

	let externalInvestmentSummary: Promise<SummaryPromise> | InvestmentSummary;
	let externalInvestmentHoldings: Promise<HoldingsPromise> | InvestmentEntity[];
	$: externalInvestmentSummary = data.api.externalInvestmentSummary;
	$: externalInvestmentHoldings = data.api.externalInvestment;

	let partialImportedFundCount = 0;
	let totalImportedFundCount = data.length;
	let isPartialImport = false;

	const getUnhappyScenario = (data: SummaryPromise) => {
		const summary = data?.data?.summary;

		if (data.status === 'failure') {
			return 'firstTimeImport';
		} else if (
			summary?.lastImportPending === false &&
			summary?.lastImportStatus === 'FAILED' &&
			summary?.investedValue === 0
		) {
			return 'errorFetchingInvestments';
		} else if (
			(summary?.lastImportPending === true && summary?.investedValue === 0) ||
			(summary?.lastImportPending === false &&
				summary?.lastImportStatus === 'PENDING' &&
				summary?.investedValue === 0)
		) {
			return 'FetchingInprogress';
		} else if (
			summary?.lastImportPending === false &&
			summary?.lastImportStatus === 'COMPLETED' &&
			summary?.investedValue === 0
		) {
			return 'noInvestmentFound';
		} else {
			return '';
		}
	};

	const setSuccessScenarioParams = (data: InvestmentEntity[]) => {
		const partialImports =
			(Array.isArray(data) &&
				data.filter((fund) => {
					return fund.externalFundImportStatus !== 'COMPLETED';
				})) ||
			[];

		partialImportedFundCount = partialImports.length;
		totalImportedFundCount = data.length;
		isPartialImport = isExternal && partialImports.length > 0;
		return true;
	};

	const UnhappyComponentsMap = {
		firstTimeImport: {
			info: FirstTimeImport,
			card: FirstTimeInfoCard
		},
		errorFetchingInvestments: {
			info: ErrorFetchingInvestments,
			card: ExternalFundsNoData
		},
		FetchingInprogress: {
			info: FetchingInprogress,
			card: ExternalFundsNoData
		},
		noInvestmentFound: {
			info: NoInvestmentFound,
			card: ExternalFundsNoData
		}
	};

	let refreshNotAllowed = false;
	let refreshErrorType: 'WAIT_TWENTY_FOUR_HOURS' | 'TECHNICAL_ERROR';
	let otpInitiated = false;
	let otpFlow: 'INITIAL' | 'REFRESH' = 'INITIAL';
	let otpStep: 'GENERATE' | 'VERIFY' | 'SUCCESS' = 'GENERATE';

	const onInitiateFundsFetch = () => {
		otpInitiated = true;
	};

	const hasTwentyFourHoursPassed = (summary: InvestmentSummary) => {
		return getTimestampHoursDifference(Date.now(), summary?.lastSuccessfullImportTs) >= 24;
	};

	const isRefreshAllowed = (data: InvestmentSummary) => {
		return hasTwentyFourHoursPassed(data) && !isPartialImport;
	};

	const onRefreshFunds = (summary: InvestmentSummary) => {
		if (isRefreshAllowed(summary)) {
			otpInitiated = true;
			otpFlow = 'REFRESH';
		} else {
			refreshNotAllowed = true;
			if (isPartialImport) {
				refreshErrorType = 'TECHNICAL_ERROR';
			} else if (!hasTwentyFourHoursPassed(summary)) {
				refreshErrorType = 'WAIT_TWENTY_FOUR_HOURS';
			}
		}
	};

	const onModalClick = () => {
		otpInitiated = false;
		refreshNotAllowed = false;
	};

	const updatePageData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?external=true`;
		const summary = useFetch(url + '&summary=true', {}, fetch);
		const holdings = useFetch(url, {}, fetch);
		// const res = await useFetch(url + '&summary=true', {}, fetch);

		const responses = await Promise.all([summary, holdings]);

		if (responses[0]?.ok) {
			// Update externalInvestmentSummary
			externalInvestmentSummary = responses[0].data;
			const resSummary = responses[0].data?.data?.summary;
			if (
				responses[1]?.ok &&
				resSummary?.lastImportPending === false &&
				resSummary?.lastImportStatus === 'COMPLETED'
			) {
				externalInvestmentHoldings = responses[1].data?.data?.holdings;
			}
		} else {
			externalInvestmentSummary = responses[0].data;
		}
	};
</script>

{#await externalInvestmentSummary}
	<section class="col-span-1 sm:col-span-1 sm:col-start-1">
		<InvestmentDashboardLoader />
	</section>
	<section class="col-span-1 col-start-1 row-start-2 sm:col-start-2 sm:row-span-3 sm:row-start-1">
		<PortfolioCardLoader />
	</section>
{:then response}
	<!-- Check for unhappy scenarios -->
	{#if getUnhappyScenario(response)}
		<!-- Render Left side for unhapy scenario -->
		<section class="col-span-1 sm:col-span-1 sm:col-start-1">
			<svelte:component
				this={UnhappyComponentsMap[getUnhappyScenario(response)].info}
				onConfirmation={onInitiateFundsFetch}
				{data}
			/>
		</section>
		<!-- Render Right Side of Unhappy Scenario -->
		<section
			class="col-span-1 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-span-3 sm:row-start-1"
		>
			<svelte:component
				this={UnhappyComponentsMap[getUnhappyScenario(response)].card}
				scenario={getUnhappyScenario(response)}
			/>
		</section>
	{:else}
		<!-- Success scenarios -->
		<!-- Render Refresh component for both partial/ full success scenario -->
		<section class="col-span-1 sm:col-span-1 sm:col-start-1">
			<RefreshFunds
				summary={response.data?.summary}
				onButtonClick={() => onRefreshFunds(response.data?.summary)}
			/>
		</section>
		{#await externalInvestmentHoldings then res}
			<!-- Render Success scenario - partial/ full success  -->
			{#if setSuccessScenarioParams(res.data?.holdings || [])}
				<section class="col-span-1 sm:col-span-1 sm:col-start-1">
					{#if res.status === 'success'}<YourInvestments
							tableData={res.data?.holdings || []}
						/>{:else}<ErrorLoadingTableData />{/if}
				</section>
				<section
					class="col-span-1 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-span-3 sm:row-start-1"
				>
					<ExternalFundsPortfolioCard
						investmentSummary={response.data?.summary}
						{partialImportedFundCount}
						{totalImportedFundCount}
						{isPartialImport}
					/>
				</section>
			{/if}
		{:catch error}
			<div>Got An error!!!</div>
		{/await}
	{/if}
{/await}
{#if refreshNotAllowed}
	<RefreshErrorModal errorType={refreshErrorType} {onModalClick} />
{:else if otpInitiated}
	<FetchFundsFlowModal
		flow={otpFlow}
		step={otpStep}
		{data}
		{onModalClick}
		onfetchFundsSuccess={updatePageData}
	/>
{/if}
