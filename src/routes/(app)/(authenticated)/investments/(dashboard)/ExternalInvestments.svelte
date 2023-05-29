<script lang="ts">
	import { onMount } from 'svelte';
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
	import ErrorLoadingComponent from '$components/ErrorLoadingComponent.svelte';
	import { partialImportCheck } from '../utils';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { getTimestampHoursDifference } from '$lib/utils/helpers/date';
	import {
		investmentExternalRefreshFlowAnalytics,
		investmentExternalPartialImportScreenOpenAnalytics,
		allTabScreenOpenAnalytics,
		allTabClickedAnalytics
	} from '../analytics';

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

	/**
	 	INITIATE FIRST TIME IMPORT (TRACK EXTERNAL FUNDS FLOW)
		1. non 200OK htpp status mean API Failed and show externa import fetch failed

		ERROR FETCHING YOUR INVESTMENTS
		2. status is 200OK && values zero && lastImportStatus=FAILED then no previous import user can ask for import again

		FETCHING IN PROGRESS
		3. status is 200OK && values zero && lastImportStatus=(STARTED|PENDING) then no previous import  and current import in pending, show refreshing and block user for importing again

		NO INVESTMENT FOUND
		4. status is 200OK && values zero && lastImportStatus=COMPLETED then previous import has no folios (highly unlikely unless user is completely new)
	*/

	const getUnhappyScenario = (data: SummaryPromise) => {
		const summary = data?.data?.summary;

		if (data.status === 'failure') {
			// INITIATE FIRST TIME IMPORT (TRACK EXTERNAL FUNDS FLOW)
			return 'firstTimeImport';
		} else if (summary?.lastImportStatus === 'FAILED' && summary?.investedValue === 0) {
			// ERROR FETCHING YOUR INVESTMENTS
			return 'errorFetchingInvestments';
		} else if (
			(summary?.lastImportStatus === 'STARTED' || summary?.lastImportStatus === 'PENDING') &&
			summary?.investedValue === 0
		) {
			// FETCHING IN PROGRESS
			return 'FetchingInprogress';
		} else if (summary?.lastImportStatus === 'COMPLETED' && summary?.investedValue === 0) {
			//NO INVESTMENT FOUND
			return 'noInvestmentFound';
		} else {
			return '';
		}
	};

	const setSuccessScenarioParams = (data: InvestmentEntity[]) => {
		const partialImports =
			(Array.isArray(data) &&
				data.filter((fund) => {
					return partialImportCheck(fund);
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

	const hasSeventyTwoHoursPassed = (summary: InvestmentSummary) => {
		return getTimestampHoursDifference(Date.now(), summary?.lastSuccessfullImportTs) >= 72;
	};

	const refreshAllowedForNormalImports = (summary: InvestmentSummary) => {
		return !isPartialImport ? hasTwentyFourHoursPassed(summary) : true;
	};

	const refreshAllowedForPartialImports = (summary: InvestmentSummary) => {
		return isPartialImport ? hasSeventyTwoHoursPassed(summary) : true;
	};

	const isRefreshAllowed = (data: InvestmentSummary) => {
		return refreshAllowedForNormalImports(data) && refreshAllowedForPartialImports(data);
	};

	const onRefreshFunds = (summary: InvestmentSummary) => {
		if (isRefreshAllowed(summary)) {
			otpInitiated = true;
			otpFlow = 'REFRESH';
		} else {
			refreshNotAllowed = true;
			if (!refreshAllowedForPartialImports(summary)) {
				refreshErrorType = 'TECHNICAL_ERROR';
			} else if (!refreshAllowedForNormalImports(summary)) {
				refreshErrorType = 'WAIT_TWENTY_FOUR_HOURS';
			}
		}
	};

	const onModalClick = () => {
		otpInitiated = false;
		refreshNotAllowed = false;
	};

	const updatePageData = async () => {
		investmentExternalRefreshFlowAnalytics({ Status: 'Success' });
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
				resSummary?.investedValue !== 0 &&
				resSummary?.lastImportStatus === 'COMPLETED'
			) {
				externalInvestmentHoldings = responses[1].data?.data?.holdings;
			}
		} else {
			externalInvestmentSummary = responses[0].data;
		}
	};

	const initiateTabClickAnalyticsClientSide = (data: InvestmentSummary) => {
		const summary = data?.data?.summary;

		if (summary?.lastImportStatus === 'FAILED' && summary?.investedValue === 0) {
			// ERROR FETCHING YOUR INVESTMENTS
			allTabClickedAnalytics({ Status: 'Failure', message: 'Import Funds Failed' });
		} else if (
			(summary?.lastImportStatus === 'STARTED' || summary?.lastImportStatus === 'PENDING') &&
			summary?.investedValue === 0
		) {
			// FETCHING IN PROGRESS
			allTabClickedAnalytics({ Status: 'Success', message: 'Fetching External Investments' });
		} else if (summary?.lastImportStatus === 'COMPLETED' && summary?.investedValue === 0) {
			//NO INVESTMENT FOUND
			allTabClickedAnalytics({ Status: 'Success', message: 'No investments found' });
		} else if (summary?.lastImportStatus === 'COMPLETED' && summary?.investedValue !== 0) {
			// SUCCESS SCENARIO - Full / Partial import
			allTabClickedAnalytics({ Status: 'Success' });
		}
	};

	function initiateScreenOpenAnalytics(data: InvestmentEntity[], summaryData: InvestmentSummary) {
		const partialImports =
			(Array.isArray(data) &&
				data.filter((fund) => {
					return partialImportCheck(fund);
				})) ||
			[];
		partialImportedFundCount = partialImports.length;
		totalImportedFundCount = data.length;
		isPartialImport = isExternal && partialImports.length > 0;
		if (isPartialImport) {
			const metaData = {
				Status: 'yes',
				Message:
					'Total Invested and Current Value may not include some of your investments due to a technical issue'
			};
			investmentExternalPartialImportScreenOpenAnalytics(metaData);
		}
		const metaData = {
			TotalInvested: summaryData?.investedValue,
			'Current Value': summaryData?.currentValue,
			TotalFunds: !isPartialImport
				? totalImportedFundCount
				: `${totalImportedFundCount - partialImportedFundCount}/${totalImportedFundCount}`,
			'Total Returns': summaryData?.returnsAbsolutePer,
			Refresh: `Last refreshed on ${new Date(
				summaryData?.lastSuccessfullImportTs
			).toLocaleDateString('en-GB', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}`
		};
		allTabScreenOpenAnalytics(metaData);
	}

	onMount(async () => {
		const summaryResponse = await externalInvestmentSummary;
		initiateTabClickAnalyticsClientSide(summaryResponse);
		const summaryHoldings = await externalInvestmentHoldings;
		initiateScreenOpenAnalytics(
			summaryHoldings?.data?.holdings || [],
			summaryResponse?.data?.summary
		);
	});
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
						/>{:else}<ErrorLoadingComponent
							title="Error Fetching Investments"
							message="We could not fetch your investment list due to a technical error. Please try again"
						/>{/if}
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
			<div>
				<ErrorLoadingComponent
					title="Error Fetching Investments"
					message="We could not fetch your investment list due to a technical error. Please try again"
				/>
			</div>
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
