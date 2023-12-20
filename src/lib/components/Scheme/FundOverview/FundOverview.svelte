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

	let schemeDetails: SchemeDetails;
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
			nfoScheme
		} = schemeDetails || {};
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
			isOpenNFO: nfoScheme === 'Y'
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

	export { schemeDetails, isNFO, innerStyle, onMountEvent };
</script>

<section class="rounded-lg bg-white p-4 pb-1 pt-3 shadow-csm sm:p-6 {$$props.class}">
	<header>
		{#if !isNFO}
			<div class="relative flex">
				<div class="flex flex-grow basis-0 flex-col pb-3 pt-3">
					<span class="text-xs text-black-bolder">Returns</span>
					<div class="flex items-end">
						<span
							class="text-xl font-medium sm:text-2xl {schemeDetails[returnPeriod] >= 0
								? 'text-green-amount'
								: 'text-red-sell'}">{schemeDetails[returnPeriod]?.toFixed(2)}%</span
						>
						<span class="ml-1 flex gap-1 pb-[2px] text-xs font-normal text-grey-body sm:text-sm">
							{#if selectedTag[0].timeScale === 'year' && selectedTag[0]?.label !== '1Y'}
								<span class="font-medium text-black-title">annually</span>
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
					<span class="mr-1 text-xs font-normal text-grey-body sm:text-sm"
						>NAV <span class="text-[10px]">on {getDateTimeString(schemeDetails?.navDate)}</span>
					</span><span class="mr-1 text-sm text-black-title"
						>₹{schemeDetails?.navValue?.toFixed(2)}</span
					>
				</div>
				<div class="flex flex-col">
					{#if schemeDetails?.isSipAllowed === 'Y'}
						<span class="text-xs font-normal text-grey-body"> Minimum SIP Investment </span><span
							class="text-sm text-black-title">₹{schemeDetails?.minSipAmount || ''}</span
						>
					{:else if schemeDetails?.isLumpsumAllowed === 'Y'}
						<span class="text-xs font-normal text-grey-body">
							Minimum One Time Investment
						</span><span class="text-sm text-black-title"
							>₹{schemeDetails?.minLumpsumAmount || ''}</span
						>
					{/if}
				</div>
			</div>
		</section>
	{/if}
</section>
