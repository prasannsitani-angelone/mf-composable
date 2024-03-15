<script lang="ts">
	import { onMount } from 'svelte';
	import YourInvestmentsNew from './YourInvestmentsNew.svelte';
	import InvestmentDashboardLoader from './Loaders/InvestmentDashboardLoader.svelte';
	import PortfolioCardLoader from '$components/PortfolioCards/PortfolioCardLoader.svelte';
	import ExternalFundsNoData from '$components/PortfolioCards/ExternalFundsNoData.svelte';
	import FamilyPortfolioState from '$components/ExternalInvestments/FamilyPortfolioState.svelte';
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
		allTabClickedAnalytics,
		allTabScreenOpenAnalytics,
		investmentExternalPartialImportScreenOpenAnalytics,
		investmentExternalRefreshFlowAnalytics
	} from '../analytics';
	import { refreshWaitHours } from '../constants';

	import type { PageData } from './$types';
	import type {
		HoldingsPromise,
		InvestmentEntity,
		InvestmentSummary,
		SummaryPromise
	} from '$lib/types/IInvestments';
	import StopExternalFundTrackingComponent from './components/externalfundstracking/StopExternalFundTrackingComponent.svelte';
	import StopExternalFundTrackingConfirmComponent from './components/externalfundstracking/StopExternalFundTrackingConfirmComponent.svelte';
	import type { ExternalFundsTrackingResponse } from './components/externalfundstracking/api';
	import { invokeRemoveExternalFundsTracking } from './components/externalfundstracking/api';
	import { invalidateAll } from '$app/navigation';
	import ExternalFundsLoadingComponent from './components/externalfundstracking/ExternalFundsLoadingComponent.svelte';
	import { toastStore } from '$lib/stores/ToastStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import InvalidExternalLinkModal from './components/InvalidExternalLinkModal.svelte';
	import ExternalInvestmentsRightSide from './components/External/ExternalInvestmentsRightSide.svelte';
	import { page } from '$app/stores';

	export let data: PageData;
	export let isFamilyPortfolio = false;

	$: isExternal = data?.isExternal;
	$: isMobile = $page?.data?.deviceType?.isMobile;

	let externalInvestmentSummary: Promise<SummaryPromise> | InvestmentSummary;
	let externalInvestmentHoldings: Promise<HoldingsPromise> | InvestmentEntity[];
	$: externalInvestmentSummary = data.api.externalInvestmentSummary;
	$: externalInvestmentHoldings = data.api.externalInvestment;

	let partialImportedFundCount = 0;
	let totalImportedFundCount = data.length;
	let isPartialImport = false;

	let showRemoveExternalFundTrackingConfirm = false;

	let initiateExternalInvestmentOtp = false;
	let showInvalidExternalLinkModal = false;

	const toggleShowInvalidExternalLinkModal = () => {
		showInvalidExternalLinkModal = !showInvalidExternalLinkModal;
	};

	const setUrlParamsData = () => {
		const { clientCode, timeStamp, otp } = data?.urlParamsValues || {};

		if (otp) {
			if ($profileStore?.clientId === clientCode) {
				const hourDiff = getTimestampHoursDifference(Date.now(), timeStamp * 1000);
				if (hourDiff < refreshWaitHours) {
					initiateExternalInvestmentOtp = true;
				} else {
					showInvalidExternalLinkModal = true;
				}
			} else {
				showInvalidExternalLinkModal = true;
			}
		}
	};

	$: if ($profileStore?.clientId?.length) {
		setUrlParamsData();
	}

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
	let otpInitiated = false;
	let otpFlow: 'INITIAL' | 'REFRESH' = 'INITIAL';
	let otpStep: 'GENERATE' | 'VERIFY' | 'SUCCESS' = 'GENERATE';

	const onInitiateFundsFetch = () => {
		otpInitiated = true;
	};

	const hasWaitingPeriodPassedPostRefresh = (summary: InvestmentSummary) => {
		const hourDiff = getTimestampHoursDifference(Date.now(), summary?.lastSuccessfullImportTs);
		return hourDiff >= refreshWaitHours;
	};

	const isRefreshAllowed = (data: InvestmentSummary) => {
		return hasWaitingPeriodPassedPostRefresh(data);
	};

	const onRefreshFunds = (summary: InvestmentSummary) => {
		if (isRefreshAllowed(summary)) {
			otpInitiated = true;
			otpFlow = 'REFRESH';
		} else {
			refreshNotAllowed = true;
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

	function setRemoveExternalFundTrackingConfirm(show: boolean) {
		showRemoveExternalFundTrackingConfirm = show;
	}

	let showRemoveExternalFundsLoader = false;

	function setRemoveExternalFundsLoader(show: boolean) {
		showRemoveExternalFundsLoader = show;
	}

	const removeExternalFunds = async () => {
		setRemoveExternalFundTrackingConfirm(false);
		setRemoveExternalFundsLoader(true);
		const result: ExternalFundsTrackingResponse = await invokeRemoveExternalFundsTracking();
		if (result?.status === 'success') {
			toastStore.updateToastQueue({
				type: 'SUCCESS',
				message: 'External investments removed successfully'
			});
			await invalidateAll();
		} else {
			toastStore.updateToastQueue({
				type: 'ERROR',
				message: 'Failed to remove external investments. Try later'
			});
		}
		setRemoveExternalFundsLoader(false);
	};

	onMount(async () => {
		const summaryResponse = await externalInvestmentSummary;
		initiateTabClickAnalyticsClientSide(summaryResponse);
		const summaryHoldings = await externalInvestmentHoldings;
		initiateScreenOpenAnalytics(
			summaryHoldings?.data?.holdings || [],
			summaryResponse?.data?.summary
		);

		// to handle Track External Funds from NXT or any other external link
		if (initiateExternalInvestmentOtp) {
			onInitiateFundsFetch();
		}
	});
</script>

<div class="px-2 py-2 md:p-0">
	{#if isFamilyPortfolio}
		<section>
			<FamilyPortfolioState />
		</section>
	{:else}
		{#await externalInvestmentSummary}
			<div class="grid">
				<section class="col-span-1 row-start-3 sm:col-span-1 sm:col-start-1">
					<InvestmentDashboardLoader />
				</section>
				<section
					class="col-span-1 col-start-1 row-start-2 sm:col-start-2 sm:row-span-3 sm:row-start-1 md:hidden"
				>
					<PortfolioCardLoader />
				</section>
			</div>
		{:then response}
			<!-- Check for unhappy scenarios -->
			{#if getUnhappyScenario(response)}
				<div class="grid">
					<!-- Render Left side for unhapy scenario -->
					<section class="col-span-1 row-start-2 sm:col-span-1 sm:col-start-1">
						<svelte:component
							this={UnhappyComponentsMap[getUnhappyScenario(response)].info}
							onConfirmation={onInitiateFundsFetch}
							{data}
						/>
					</section>
					<!-- Render Right Side of Unhappy Scenario -->
					<section
						class="col-span-1 row-start-1 sm:col-span-1 sm:col-start-2 sm:row-span-3 md:hidden"
					>
						<svelte:component
							this={UnhappyComponentsMap[getUnhappyScenario(response)].card}
							scenario={getUnhappyScenario(response)}
						/>
					</section>
				</div>
			{:else}
				<!-- Success scenarios -->
				{#await externalInvestmentHoldings}
					<ExternalFundsLoadingComponent />
				{:then res}
					{#if showRemoveExternalFundsLoader}
						<ExternalFundsLoadingComponent />
					{:else if setSuccessScenarioParams(res.data?.holdings || [])}
						{#if isMobile}
							<ExternalInvestmentsRightSide
								investmentSummary={response.data?.summary}
								{partialImportedFundCount}
								{totalImportedFundCount}
								{isPartialImport}
							/>
						{/if}
						<section class="col-span-1 row-start-3 sm:col-span-1 sm:col-start-1">
							<!-- Render Refresh component for both partial/ full success scenario -->
							<section class="col-span-1 row-start-2 sm:col-span-1 sm:col-start-1">
								{#if !showRemoveExternalFundsLoader}
									<RefreshFunds
										summary={response.data?.summary}
										onButtonClick={() => onRefreshFunds(response.data?.summary)}
									/>
								{/if}
							</section>
							{#if res.status === 'success'}
								<YourInvestmentsNew tableData={res.data?.holdings || []} />

								<StopExternalFundTrackingComponent
									class="my-4"
									on:stopTrackingClicked={() => setRemoveExternalFundTrackingConfirm(true)}
								/>
							{:else}
								<ErrorLoadingComponent
									title="Error Fetching Investments"
									message="We could not fetch your investment list due to a technical error. Please try again"
								/>
							{/if}
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
			{#if refreshNotAllowed}
				<RefreshErrorModal {onModalClick} summary={response.data?.summary} />
			{:else if otpInitiated}
				<FetchFundsFlowModal
					flow={otpFlow}
					step={otpStep}
					{data}
					{onModalClick}
					onfetchFundsSuccess={updatePageData}
				/>
			{/if}
		{/await}
	{/if}
</div>

{#if showRemoveExternalFundTrackingConfirm}
	<StopExternalFundTrackingConfirmComponent
		on:removeTrackingClicked={removeExternalFunds}
		on:dismiss={() => setRemoveExternalFundTrackingConfirm(false)}
	/>
{/if}

{#if showInvalidExternalLinkModal}
	<InvalidExternalLinkModal
		openErrorModal={showInvalidExternalLinkModal}
		on:closeErrorModal={toggleShowInvalidExternalLinkModal}
	/>
{/if}
