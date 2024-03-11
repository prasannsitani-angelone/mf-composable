<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import PageTitle from '$components/PageTitle.svelte';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import type { ITab } from '$lib/types/ITab';
	import NoFilterResult from '$lib/images/NoFilterResult.svg';
	import InvestmentTab from '../(dashboard)/components/InvestmentTab.svelte';
	import type { PageData } from './$types';
	import TaxationTable from './TaxationTable.svelte';
	import BigDotIcon from '$lib/images/icons/BigDotIcon.svelte';
	import {
		longTermInvestmentImpressionAnalytics,
		longTermTabClickAnalytics,
		shortTermInvestmentImpressionAnalytics,
		shortTermTabClickAnalytics
	} from '../analytics';
	import { page } from '$app/stores';
	import { encodeObject } from '$lib/utils/helpers/params';
	import type { ITaxationDetails } from '$lib/types/IInvestments';
	import { browser } from '$app/environment';

	export let data: PageData;

	const { investmentPercent = 0, investedAmt = 0 } = $page.data.urlSource;

	const encodedParams = encodeObject({
		investmentPercent,
		investedAmt
	});

	const navigateToEquite = async () => {
		await goto(
			`${base}/investments/ltcg-stcg-gains?taxType=${data?.taxType}&holdingType=EQUITY&params=${encodedParams}`,
			{ replaceState: true }
		);
		if (data?.taxType === 'STCG') {
			shortTermTabClickAnalytics({ CategoryOption: 'Equity' });
		} else if (data?.taxType === 'LTCG') {
			longTermTabClickAnalytics({ CategoryOption: 'Equity' });
		}
	};
	$: activeTab = data?.holdingType === 'NON_EQUITY' ? 'Non-Equity' : 'Equity';
	const navigateToNonEquity = async () => {
		await goto(
			`${base}/investments/ltcg-stcg-gains?taxType=${data?.taxType}&holdingType=NON_EQUITY&params=${encodedParams}`,
			{ replaceState: true }
		);
		if (data?.taxType === 'STCG') {
			shortTermTabClickAnalytics({ CategoryOption: 'Non-Equity' });
		} else if (data?.taxType === 'LTCG') {
			longTermTabClickAnalytics({ CategoryOption: 'Non-Equity' });
		}
	};

	const tabs: ITab[] = [
		{
			name: 'Equity',
			onClick: navigateToEquite
		},
		{
			name: 'Non-Equity',
			onClick: navigateToNonEquity
		}
	];

	$: analyticsEventPromise = browser
		? data?.api?.getTaxationDetails?.then((taxationDetails: ITaxationDetails[]) => {
				const eventMetaData = taxationDetails
					.map((taxationDetails: ITaxationDetails, index) => {
						const obj = {};
						obj[`FundName${index + 1}`] = taxationDetails.schemeName;
						obj[`Amount${index + 1}`] = taxationDetails.investedAmount;
						return obj;
					})
					.reduce((accumulator, currentValue) => {
						return { ...accumulator, ...currentValue };
					}, {});

				if (data?.taxType === 'STCG') {
					shortTermInvestmentImpressionAnalytics({
						shortterminvestment: `${investmentPercent}%`,
						Currentvalue: investedAmt,
						CategoryOption: activeTab,
						...eventMetaData
					});
				} else if (data?.taxType === 'LTCG') {
					longTermInvestmentImpressionAnalytics({
						longterminvestment: `${investmentPercent}%`,
						Currentvalue: investedAmt,
						CategoryOption: activeTab,
						...eventMetaData
					});
				}
		  })
		: {};
</script>

<article class="flex flex-col items-center justify-center sm:items-start">
	<header class="mb-2 hidden sm:block">
		<PageTitle title={data?.title} class="mb-0 sm:mb-4 sm:flex" />
	</header>
	{#if data?.taxType === 'STCG'}
		<div
			class="sticky -top-2 z-100 -mt-2 ml-[calc(50%-50vw)] w-screen border-b bg-background-alt px-4 py-3 text-xs text-title sm:relative sm:top-0 sm:ml-0 sm:w-full sm:rounded-lg sm:py-6"
		>
			<p class="flex">
				<span class="mr-2 mt-1">
					<BigDotIcon />
				</span>
				<span>
					Short Term Capital Gains tax for <span class="font-medium">Equity</span> (less than 1
					year) and
					<span class="font-medium">Non-Equity</span> (less than 3 years) funds is calculated differently
					on withdrawal
				</span>
			</p>
			<p class="mt-2 flex">
				<span class="mr-2 mt-1">
					<BigDotIcon />
				</span>
				<span>
					STCG tax will be applicable if you withdraw these investments today. Stay invested to
					avoid short term taxes
				</span>
			</p>
		</div>
	{:else}
		<div
			class="sticky -top-2 z-100 -mt-2 ml-[calc(50%-50vw)] w-screen border-b bg-background-alt px-4 py-3 text-xs text-title sm:relative sm:top-0 sm:ml-0 sm:w-full sm:rounded-lg sm:py-6"
		>
			<p class="flex">
				<span class="mr-2 mt-1">
					<BigDotIcon />
				</span>
				<span>
					Long Term Capital Gains tax for <span class="font-medium">Equity</span> (more than 1 year)
					and
					<span class="font-medium">Non-Equity</span> (more than 3 years) funds is calculated differently
					on withdrawal
				</span>
			</p>
			<p class="mt-2 flex">
				<span class="mr-2 mt-1">
					<BigDotIcon />
				</span>
				<span>LTCG tax will be applicable if you withdraw these investments today </span>
			</p>
		</div>
	{/if}
	<InvestmentTab {tabs} {activeTab} class="mt-2 !px-0 max-sm:ml-0" />
	{#await data?.api?.getTaxationDetails}
		<TableSkeleton />
	{:then taxationDetails}
		{#if taxationDetails?.length}
			<TaxationTable {taxationDetails} class="bg-background-alt px-4 pt-3" />
		{:else}
			<section
				class="flex w-full flex-col items-center justify-center rounded bg-background-alt pb-6 pt-8"
			>
				<img src={NoFilterResult} width="110" height="110" loading="lazy" alt="No scheme found" />
				<div class="pt-4 font-medium text-black-key">
					No {data?.taxType === 'STCG' ? 'Short Term' : 'Long Term'}
					{activeTab === 'Equity' ? activeTab : 'Non Equity'} Investments
				</div>
				<div class="mt-2 px-4 text-center text-sm text-body">
					{#if data?.taxType === 'STCG'}
						You do not have any short term {activeTab === 'Equity' ? 'equity' : 'non equity'} investments
					{:else}
						Hold <span class="lowercase">{activeTab === 'Equity' ? 'equity' : 'non equity'}</span>
						investments for
						<span class="font-medium text-black-key"
							>more than {activeTab === 'equity' ? '3 years' : '1 year'}</span
						> to track them as long term investments
					{/if}
				</div>
			</section>
		{/if}
	{/await}
</article>
