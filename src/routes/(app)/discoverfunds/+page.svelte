<script lang="ts">
	import TrendingFunds from './TrendingFunds/TrendingFunds.svelte';
	import StartNewInvestment from './StartNewInvestment.svelte';
	import ExploreScheme from './ExploreScheme/ExploreScheme.svelte';
	import PortfolioCard from '$components/PortfolioCards/PortfolioCard.svelte';
	import type { InvestmentSummary } from '$lib/types/IInvestments';
	import { page } from '$app/stores';
	import SipCard from '../(authenticated)/orders/orderspage/sipbook/SipCard.svelte';
	import type { INudge, IRetryPaymentNudge, NudgeDataType } from '$lib/types/INudge';
	import { format } from 'date-fns';
	import type { IDueSips, ISip } from '$lib/types/ISipType';
	import FailedOrdersNudge from './FailedOrdersNudge.svelte';
	import DiscoverFundsNudge from '$components/Nudge/DiscoverFundsNudge.svelte';
	import {
		homepageMultipleSipPaymentDueNudgeImpressionAnalytics,
		homepageSipPaymentDueNudgeImpressionAnalytics,
		nudgeClick,
		nudgeImpression
	} from '$lib/analytics/DiscoverFunds';
	import type { PageData } from './$types';

	$: showPortfoliocard = true;
	$: deviceType = $page.data.deviceType;
	let sipPaymentNudges: ISip[] = [];
	let retryPaymentNudges: IRetryPaymentNudge[] = [];
	let formattedSipNudgeData: ISip;
	let nudgesData: NudgeDataType;

	let formattedRetryPaymentNudgeData: IRetryPaymentNudge;

	const onPortfolioDataReceived = (
		event: CustomEvent<{ investmentSummary: InvestmentSummary }>
	) => {
		const { currentValue } = event.detail.investmentSummary;
		if (!currentValue) {
			showPortfoliocard = false;
		}
	};

	const setSipNudgesData = (nudgeData: NudgeDataType) => {
		sipPaymentNudges = [];
		nudgeData?.nudges?.forEach((nudge: INudge) => {
			if (nudge?.nudgesType === 'SIP_INSTALLMENT') {
				const data = nudge?.data || {};
				sipPaymentNudges.push({ ...data });
			}
		});

		if (deviceType?.isMobile && sipPaymentNudges?.length) {
			formattedSipNudgeData = sipPaymentNudges?.[0];

			if (sipPaymentNudges?.length > 1) {
				let amountSum = 0;
				sipPaymentNudges?.forEach((sip) => {
					amountSum += sip?.installmentAmount;
				});
				formattedSipNudgeData.schemeName = `${sipPaymentNudges?.length} Pending SIP Payments`;
				formattedSipNudgeData.installmentAmount = amountSum;
			}
		}

		// sip payments due analytics
		if (sipPaymentNudges?.length) {
			if (sipPaymentNudges?.length > 1) {
				const dueSips: IDueSips[] = [];

				sipPaymentNudges?.forEach((sip) => {
					dueSips.push({
						SipCount: `${sipPaymentNudges?.length} Pending SIP Payments`,
						Amount: sip?.installmentAmount,
						SipPaymentDue: sip?.installmentAmount,
						SipDate: format(new Date(sip?.sipPaymentDate), 'dd-MMM-yyyy'),
						PayBefore: format(new Date(sip?.sipAmountPayTillDate), 'dd-MMM-yyyy')
					});
				});
				homepageMultipleSipPaymentDueNudgeImpressionAnalytics({ dueSips });
			} else {
				const eventMetaData = {
					FundName: sipPaymentNudges?.[0]?.schemeName,
					Amount: sipPaymentNudges?.[0]?.installmentAmount,
					SipPaymentDue: sipPaymentNudges?.[0]?.installmentAmount,
					SipDate: format(new Date(sipPaymentNudges?.[0]?.sipPaymentDate), 'dd-MMM-yyyy'),
					PayBefore: format(new Date(sipPaymentNudges?.[0]?.sipAmountPayTillDate), 'dd-MMM-yyyy')
				};
				homepageSipPaymentDueNudgeImpressionAnalytics(eventMetaData);
			}
		}
		return '';
	};

	const setRetryPaymentNudgesData = (nudgeData: NudgeDataType) => {
		retryPaymentNudges = [];
		nudgeData?.nudges?.forEach((nudge: INudge) => {
			if (nudge?.nudgesType === 'PAYMENT_FAILED') {
				const data = nudge?.data || {};
				retryPaymentNudges.push({ ...data });
			}
		});

		if (retryPaymentNudges?.length) {
			formattedRetryPaymentNudgeData = retryPaymentNudges?.[0];
			formattedRetryPaymentNudgeData.orderDate = format(
				new Date(Number(formattedRetryPaymentNudgeData?.orderDate || 0) * 1000),
				'dd MMM yyyy'
			);

			if (retryPaymentNudges?.length > 1) {
				let amountSum = 0;
				retryPaymentNudges?.forEach((order) => {
					amountSum += order?.amount;
				});
				formattedRetryPaymentNudgeData.schemeName = 'Multiple payments failed';
				formattedRetryPaymentNudgeData.amount = amountSum;
			}
		}
		return '';
	};

	const setNudgeData = (nudgeData: NudgeDataType) => {
		nudgesData = nudgeData;
		return '';
	};
	export let data: PageData;
</script>

{#await data?.getNudgeData}
	<span />
{:then nudgeData}
	{(() => setNudgeData(nudgeData))()}
	{(() => setSipNudgesData(nudgeData))()}
	{(() => setRetryPaymentNudgesData(nudgeData))()}
{/await}
<article>
	<!-- <InvestmentsStories /> -->
	{#if showPortfoliocard && deviceType?.isMobile}
		<div class="mb-2 overflow-hidden sm:mb-0">
			<PortfolioCard discoverPage={true} on:portfolidataReceived={onPortfolioDataReceived} />
		</div>
	{/if}
	{#if deviceType?.isMobile && sipPaymentNudges?.length}
		<SipCard sip={formattedSipNudgeData} sipCount={sipPaymentNudges?.length} />
	{/if}
	<article class="max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-0">
		<ExploreScheme searchOptions={data?.searchDashboardData?.searchOptions} />
	</article>
	{#if retryPaymentNudges?.length}
		<FailedOrdersNudge
			order={formattedRetryPaymentNudgeData}
			orderCount={retryPaymentNudges?.length}
		/>
	{/if}
	{#if nudgesData?.nudges?.length}
		{#each nudgesData?.nudges as nudge, index (index)}
			<section>
				{#if nudge?.nudgesType !== 'mandate' && nudge?.nudgesType !== 'SIP_INSTALLMENT' && nudge?.nudgesType !== 'PAYMENT_FAILED'}
					<DiscoverFundsNudge
						{nudge}
						clickEvent={nudgeClick}
						impressionEvent={nudgeImpression}
						class="mt-2 sm:mt-4"
					/>
				{/if}
			</section>
		{/each}
	{/if}
	<TrendingFunds tableData={data?.searchDashboardData?.weeklyTopSchemes} />
</article>

{#if deviceType?.isBrowser}
	<article>
		{#if showPortfoliocard}
			<PortfolioCard discoverPage={true} on:portfolidataReceived={onPortfolioDataReceived} />
		{:else}
			<StartNewInvestment />
		{/if}
		{#if sipPaymentNudges?.length}
			{#each sipPaymentNudges as sip, index (sip?.sipId + index)}
				<SipCard {sip} />
			{/each}
		{/if}
	</article>
{/if}
