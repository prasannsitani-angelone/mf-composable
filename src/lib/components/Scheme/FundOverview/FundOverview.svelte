<script lang="ts">
	import { page } from '$app/stores';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { tags } from '$lib/constants/tags';
	import type { Tags } from '$lib/types/ITags';

	import NavCharts from './NavCharts.svelte';
	import { onMount } from 'svelte';
	import { sFundDetails } from '../analytics';
	import { getDeeplinkForUrl } from '$lib/utils/helpers/deeplinks';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import type { FundComparisons } from '../types';

	let schemeDetails: SchemeDetails;
	let comparisons: FundComparisons;
	let selectedTag: Tags[];
	let isNFO = false;
	let onMountEvent = true;
	$: selectedTag = [
		{
			label: '3Y',
			months: 36,
			timeScale: 'year',
			returnPeriod: 'returns3yr',
			bmReturnPeriod: 'bmReturns3yr',
			text: '3 Year'
		}
	];

	let returnPeriod: keyof Tags;

	$: returnPeriod = selectedTag[0].returnPeriod;

	const handleChartRangeChange = (event: { detail: { text: number } }) => {
		const selectedMonth: number = event?.detail?.text;
		selectedTag = tags.filter((val) => val.months === selectedMonth);
	};

	onMount(() => {
		const {
			schemeName,
			arqRating,
			navValue,
			reInvestmentPlan,
			subcategoryName,
			exitLoadValue,
			expenseRatio,
			isin,
			returns3yr,
			isSipAllowed,
			isLumpsumAllowed,
			nfoScheme,
			minSipAmount,
			noOfClientInvested
		} = schemeDetails || {};
		const { otherScheme } = comparisons || {};
		const eventMetadata = {
			Fundname: schemeName,
			FundType: reInvestmentPlan,
			SubAssetType: subcategoryName,
			Rating: arqRating,
			Nav: navValue,
			'Exit Load': exitLoadValue,
			'Expense Ratio': expenseRatio,
			URL: getDeeplinkForUrl($page.url),
			ISIN: isin,
			'3YReturn': returns3yr || 0,
			isSIPAllowed: isSipAllowed === 'Y',
			isOTIAllowed: isLumpsumAllowed === 'Y',
			isOpenNFO: nfoScheme === 'Y',
			minSIPamount: minSipAmount,
			compareFundsCardVisible: nfoScheme !== 'Y',
			compareFundCardFunds: [schemeName, otherScheme?.[0]?.schemeName],
			compareFundCardFundsISIN: [isin, otherScheme?.[0]?.isin],
			compareFundCardFunds3YReturn: [returns3yr || 0, otherScheme?.[0]?.returns3yr || 0],
			compareFundCardFundsMinSIPAmount: [minSipAmount, otherScheme?.[0]?.minSipAmount],
			compareFundCardFundsNoofInvestors: [noOfClientInvested, otherScheme?.[0]?.noOfClientInvested]
		};
		if (onMountEvent) {
			sFundDetails(eventMetadata);
		}
	});

	let pagePathname: string;
	$: pagePathname = $page.url?.pathname;
	function getReturnText(tag: Tags) {
		const map = {
			'1M': 'in the last 1 month',
			'3M': 'in the last 3 months',
			'6M': 'in the last 6 months',
			'1Y': 'in the last 1 year',
			'3Y': 'for last 3 years',
			'5Y': 'for last 5 years',
			ALL: 'since the fund launched'
		};

		return map[tag.label] || '';
	}

	let innerStyle = '';

	export { schemeDetails, isNFO, innerStyle, onMountEvent, comparisons };
</script>

<section class="rounded-lg bg-background-alt p-4 pb-1 pt-3 shadow-csm sm:p-6 {$$props.class}">
	<header>
		{#if !isNFO}
			<div class="relative flex">
				<div class="flex flex-grow basis-0 flex-col pb-3 pt-3">
					<span class="text-xs text-body">Returns</span>
					<div class="flex items-end">
						<span
							class="text-xl font-medium sm:text-2xl {schemeDetails[returnPeriod] >= 0
								? 'text-buy'
								: 'text-sell'}">{schemeDetails[returnPeriod]?.toFixed(2)}%</span
						>
						<span class="ml-1 flex gap-1 pb-[2px] text-xs font-normal text-body sm:text-sm">
							{#if selectedTag[0].timeScale === 'year' && selectedTag[0]?.label !== '1Y'}
								<span class="font-medium text-title">annually</span>
							{/if}

							{getReturnText(selectedTag[0])}</span
						>
					</div>
				</div>
			</div>
		{/if}
	</header>
	{#if !isNFO}
		<section class={innerStyle}>
			<NavCharts {schemeDetails} on:chartRangeChange={handleChartRangeChange} />
			<div class="mt-9 flex justify-between sm:justify-center sm:gap-28">
				<div class="flex flex-col">
					<span class="mr-1 text-xs font-normal text-body sm:text-sm"
						>NAV <span class="text-[10px]">on {getDateTimeString(schemeDetails?.navDate)}</span>
					</span><span class="mr-1 text-sm text-title">₹{schemeDetails?.navValue?.toFixed(2)}</span>
				</div>
				<div class="flex flex-col">
					{#if schemeDetails?.isSipAllowed === 'Y'}
						<span class="text-xs font-normal text-body"> Minimum SIP Investment </span><span
							class="text-sm text-title">₹{schemeDetails?.minSipAmount || ''}</span
						>
					{:else if schemeDetails?.isLumpsumAllowed === 'Y'}
						<span class="text-xs font-normal text-body"> Minimum One Time Investment </span><span
							class="text-sm text-title">₹{schemeDetails?.minLumpsumAmount || ''}</span
						>
					{/if}
				</div>
			</div>
		</section>
	{/if}
</section>
