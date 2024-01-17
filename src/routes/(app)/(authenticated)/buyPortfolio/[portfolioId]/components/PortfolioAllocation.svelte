<script lang="ts">
	import LinearChart from '$components/Charts/LinearChart.svelte';
	import CueCardCarouselComponent from '$components/CueCardCarouselComponent.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
	import type { LinearChartInput } from '$lib/types/IChart';
	import { onMount } from 'svelte';
	import { WMSIcon } from 'svelte-components';
	import FundOverviewCueCard from '$components/Scheme/cuecards/FundOverviewCueCard.svelte';
	import SchemeInformationCueCard from '$components/Scheme/cuecards/SchemeInformationCueCard.svelte';
	import RiskAndRatingCueCard from '$components/Scheme/cuecards/RiskAndRatingCueCard.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';
	import { browser } from '$app/environment';
	import { schemeInfoCueCardDetailsClickEvent } from '$components/Scheme/cuecards/analytics';
	import {
		portfolioFundsImpression,
		type IFund,
		fundCardClick
	} from '$lib/analytics/buyPortfolio/buyPortfolio';

	export let portfolioPack: PortfolioPack;
	export let showWeightage = false;
	export let showAmount = false;
	export let amount = 0;

	let showFundDetailCarousel = false;
	let colors = ['#B99AE6', '#FACE80', '#E3A0A4', '#80E0EA', '#7D8FE6', '#82CFBF'];
	let linearChartInput: LinearChartInput[] = [];
	let fundDetailsCarouselItems = [];
	let currentVisibleCueCardIndex = 0;
	let schemeData: SchemeDetails;
	$: schemeDetails = schemeData;

	portfolioPack.schemes.forEach((x, i) => {
		linearChartInput.push({ name: x.isin, color: colors[i], weightage: x.wieightPercentage });
	});

	const getSchemeData = async (isin: string, schemeCode: string) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		const res = await useFetch(
			url,
			{
				headers: {
					'X-LRU': 'true',
					'X-Skip-Validation': false
				}
			},
			fetch
		);

		if (res.ok) {
			schemeData = res.data;
		} else {
			if (browser) {
				goto(`${base}/schemes/error`, { replaceState: true });
			} else {
				throw redirect(302, `${base}/schemes/error`);
			}
		}

		return schemeData;
	};

	const goToFundDetailsPage = async (
		isin: string,
		schemeCode: string,
		itemNo: number,
		weightage: number
	) => {
		schemeData = await getSchemeData(isin, schemeCode);
		fundDetailsCarouselItems = getFundDetailsCarouselItems();
		showFundDetailCarousel = true;
		if (showWeightage) {
			const metaData = {
				SelectedFundNo: itemNo + 1,
				FundName: schemeData?.schemeName,
				Weightage: weightage,
				'3yReturn': schemeData?.returns3yr
			};
			fundCardClick(metaData);
		}
	};
	const handleCueCardLoad = (e) => {
		if (showFundDetailCarousel) {
			currentVisibleCueCardIndex = e?.detail?.index || 0;
		}
	};

	onMount(async () => {
		fundDetailsCarouselItems = getFundDetailsCarouselItems();
		if (showWeightage) {
			const funds: IFund[] = [];
			portfolioPack?.schemes?.forEach((x) => {
				const fund = {
					FundName: x.schemeName,
					FundWeightage: x.wieightPercentage
				};
				funds.push(fund);
			});
			portfolioFundsImpression(funds);
		}
	});

	const getFundDetailsCarouselItems = () => {
		let carouselItems = [];
		carouselItems.push(getFundOverviewCueCard());
		carouselItems.push(getSchemeInformationCueCard());
		carouselItems.push(getRiskAndRatingCueCard());
		return carouselItems;
	};
	function getSchemeInformationCueCard() {
		return {
			component: SchemeInformationCueCard,
			props: {
				schemeDetails: schemeDetails,
				isNFO: false
			}
		};
	}
	function getRiskAndRatingCueCard() {
		return {
			component: RiskAndRatingCueCard,
			props: {
				schemeDetails: schemeDetails,
				schemeDetailsClicked: () => {
					const isLast = currentVisibleCueCardIndex === fundDetailsCarouselItems.length - 1;
					schemeInfoCueCardDetailsClickEvent({
						ISIN: schemeData.isin,
						CardName: 'RatingRisk',
						isOpenNFO: false,
						cardrank: currentVisibleCueCardIndex + 1,
						islastcard: isLast
					});
				}
			}
		};
	}
	function getFundOverviewCueCard() {
		return {
			component: FundOverviewCueCard,
			props: { schemeDetails: schemeDetails }
		};
	}
</script>

<section>
	<div class="pb-3 font-medium text-black-key">Portfolio Allocation</div>
	{#if showWeightage}
		<LinearChart chartInput={linearChartInput}>
			<svelte:fragment slot="weightage" let:inputVar>
				<div class="flex items-center justify-center pt-2 text-center text-sm">
					<WMSIcon name="eclipse" width={8} height={8} stroke={inputVar.color} />
					<div class="pl-2">{inputVar.weightage}%</div>
				</div>
			</svelte:fragment>
		</LinearChart>
	{:else}
		<div class="pb-3 text-xs text-black-bolder">No. of SIPs - {portfolioPack.schemes.length}</div>
	{/if}
	<div class="flex justify-between border-b pb-2 text-xs text-grey-body">
		<p>Fund</p>
		<p>{showWeightage ? 'Weightage (%)' : 'Amount'}</p>
	</div>
	{#each portfolioPack.schemes as scheme, i}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="mt-2 flex items-start justify-between py-2 text-black-key"
			on:click={() => {
				goToFundDetailsPage(scheme.isin, scheme.schemeCode, i, scheme.wieightPercentage);
			}}
		>
			<div class="flex">
				<SchemeLogo size="xs2" src={scheme.logoUrl} alt={scheme.schemeName} />
				<div class="flex flex-col self-center text-sm font-normal">
					<p>{scheme.schemeName}</p>
					<p class="text-grey-body">3Y Returns: {scheme?.returns3yr?.toFixed(2)}%</p>
				</div>
			</div>
			<div class="flex items-start text-sm font-medium">
				{#if showWeightage}
					<div class="flex items-center pl-8">
						<WMSIcon name="eclipse" width={8} height={8} stroke={colors[i]} />
						<span class="pl-2">{scheme.wieightPercentage}</span>
						<WMSIcon class="pl-2" name="right-arrow" stroke="#3F5BD9" />
					</div>
				{:else if showAmount}
					₹{(scheme.wieightPercentage * amount) / 100}
				{/if}
			</div>
		</div>
	{/each}
	{#if schemeData}
		<CueCardCarouselComponent
			bind:isModalOpen={showFundDetailCarousel}
			carouselItems={fundDetailsCarouselItems}
			on:cueCardLoad={handleCueCardLoad}
		/>
	{/if}
</section>
