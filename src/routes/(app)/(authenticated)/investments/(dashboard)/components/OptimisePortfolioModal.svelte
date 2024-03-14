<script lang="ts">
	import SchemeCardExt from '$components/SchemeCardExt.svelte';
	import {
		BtnSize,
		BtnVariant,
		Modal,
		WMSIcon,
		SkeletonRectangle,
		SkeletonWrapper
	} from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import PortfolioPerformace from '$lib/images/PortfolioPerformace.svelte';
	import type {
		IOPtimsiePortfolioData,
		InvestmentEntity,
		InvestmentSummary
	} from '$lib/types/IInvestments';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { useFetch } from '$lib/utils/useFetch';
	import { calculateLumpsumReturns, calculateSipReturns } from '$lib/utils/helpers/returns';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import {
		fundForYouClickTextAnalytics,
		fundForYouInvestClickAnalytics,
		fundForYouPopUpImpressionAnalytics,
		fundForYouWhyImpressionAnalytics
	} from '../../analytics';
	import { FUND_CATEGORY_RETURNS } from '$lib/constants/fund';

	export let optimisePorfolioData: IOPtimsiePortfolioData;
	export let toggleOptimisePorfolioCard: (flag: boolean) => void;
	export let investmentSummary: InvestmentSummary;
	export let currentScheme: InvestmentEntity;
	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isFetchingScheme = true;
	let schemeDetails: SchemeDetails;
	let currentSchemeDetails: SchemeDetails;
	let showFundModal = false;

	const toggleFundModal = (flag: boolean) => {
		showFundModal = flag;
		if (flag) {
			fundForYouClickTextAnalytics({
				Fundname: schemeDetails?.schemeName,
				'Minimum SIP amount': schemeDetails?.minSipAmount,
				Returns: schemeDetails?.returns3yr
			});
			fundForYouWhyImpressionAnalytics();
		}
	};
	const getSchemeData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${optimisePorfolioData?.isin}/${optimisePorfolioData?.schemeCode}`;
		return await useFetch(url, {}, fetch);
	};
	const getCurrentSchemeData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${currentScheme?.isin}/${currentScheme?.schemeCode}`;
		return await useFetch(url, {}, fetch);
	};

	// Calcultion for the graph details
	$: threeYearReturnsValue =
		Math.round(
			calculateSipReturns(
				schemeDetails?.minSipAmount < 500 ? 500 : schemeDetails?.minSipAmount,
				3,
				schemeDetails?.returns3yr > 0
					? schemeDetails?.returns3yr
					: FUND_CATEGORY_RETURNS[schemeDetails?.categoryName?.toUpperCase()] ||
							FUND_CATEGORY_RETURNS.Equity
			)?.matuarityAmount * 100
		) / 100;
	$: threeReturnsWithoutInvestment =
		(currentSchemeDetails?.sipEnabled
			? Math.round(
					calculateSipReturns(
						schemeDetails?.minSipAmount < 500 ? 500 : schemeDetails?.minSipAmount,
						3,
						currentSchemeDetails?.returns3yr > 0
							? currentSchemeDetails?.returns3yr
							: FUND_CATEGORY_RETURNS[currentSchemeDetails?.categoryName?.toUpperCase()] ||
									FUND_CATEGORY_RETURNS.Equity
					)?.matuarityAmount * 100
			  ) /
					100 +
			  (investmentSummary?.currentValue || 0)
			: Math.round(
					calculateLumpsumReturns(
						investmentSummary?.currentValue || 0,
						3,
						currentSchemeDetails?.returns3yr
					)?.matuarityAmount * 100
			  ) / 100) + (investmentSummary?.currentValue || 0);
	$: totalReturns = threeReturnsWithoutInvestment + threeYearReturnsValue;

	// Call the API's onMount of Modal
	onMount(async () => {
		isFetchingScheme = true;
		await Promise.all([getSchemeData(), getCurrentSchemeData()]).then((res) => {
			(schemeDetails = res[0].ok ? res[0]?.data || {} : {}),
				(currentSchemeDetails = res[1].ok ? res[1]?.data || {} : {});
			fundForYouPopUpImpressionAnalytics({
				Fundname: schemeDetails?.schemeName,
				'Minimum SIP amount': schemeDetails?.minSipAmount,
				Returns: schemeDetails?.returns3yr
			});
			isFetchingScheme = false;
		});
	});

	const gotoSchemeDetails = () => {
		fundForYouInvestClickAnalytics({
			Fundname: schemeDetails?.schemeName,
			'Minimum SIP amount': schemeDetails?.minSipAmount,
			Returns: schemeDetails?.returns3yr
		});
		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			schemeDetails?.schemeName,
			schemeDetails?.isin,
			schemeDetails?.schemeCode
		)}?orderpad=INVEST&params=${encodeObject({
			investmentType: 'SIP',
			paymentMandatory: true
		})}`;
		goto(schemeDetailsPath);
	};
</script>

<Modal isModalOpen {isMobile} on:backdropclicked={() => toggleOptimisePorfolioCard(false)}>
	<div class="w-full rounded-t-2xl bg-background-alt px-5 py-4 sm:w-120 sm:!rounded-lg">
		<div class="mb-4">
			<div class="flex items-center text-lg font-normal">
				<div class="flex-1 font-medium text-title">2nd SIP For Your Portfolio</div>
				<WMSIcon
					name="cross-circle"
					class="hidden cursor-pointer sm:block"
					on:click={() => toggleOptimisePorfolioCard(false)}
					width={24}
					height={24}
				/>
			</div>
			<p class="mt-1 text-sm text-body">Maximise your returns by investing in this fund</p>
		</div>
		<section class="flex max-h-[65vh] flex-col overflow-auto">
			{#if !isFetchingScheme}
				<SchemeCardExt disableRedirection={true} showTopRated schemes={schemeDetails}>
					<svelte:fragment slot="titleRightSection">
						<span />
					</svelte:fragment>
				</SchemeCardExt>
			{:else}
				<SkeletonWrapper class="w-full">
					<SkeletonRectangle class="!h-48" />
				</SkeletonWrapper>
			{/if}
			<div class="flex flex-col justify-center">
				<ButtonMedium
					size={BtnSize.XS}
					class="my-4"
					variant={BtnVariant.Transparent}
					on:click={() => toggleFundModal(true)}
				>
					WHY THIS FUND?
				</ButtonMedium>
				<div class="flex flex-col items-center">
					<p class="text-sm font-normal text-title">Projected portfolio performance</p>
					{#if !isFetchingScheme}
						<div class="my-4 flex flex-col text-xs font-normal text-title">
							<div class="flex flex-row">
								<PortfolioPerformace />
								<div class="ml-[-12px] mt-[5px] flex flex-col">
									<div class="h-[59px]">
										<p>₹{addCommasToAmountString(totalReturns?.toFixed(2) || 0)}</p>
									</div>
									<div>
										₹{addCommasToAmountString(threeReturnsWithoutInvestment?.toFixed(2) || 0)}
									</div>
								</div>
							</div>
							<div class="mt-[-2px]">
								₹{addCommasToAmountString(investmentSummary?.currentValue?.toFixed(2) || 0)}
							</div>
						</div>
					{:else}
						<SkeletonWrapper class="my-4 w-full">
							<SkeletonRectangle class="!h-40" />
						</SkeletonWrapper>
					{/if}
					<p class="text-1xs text-body">
						Disclaimer: Projected values are based on fund’s last 3 years CAGR with a monthly SIP of
						₹{addCommasToAmountString(
							schemeDetails?.minSipAmount < 500 ? '500' : schemeDetails?.minSipAmount?.toString()
						)}. Your actual returns may vary.
					</p>
				</div>
			</div>
		</section>
		<section class="mt-2 flex flex-col">
			<ButtonMedium class="mt-4" on:click={gotoSchemeDetails}>INVEST NOW</ButtonMedium>
		</section>
	</div>
</Modal>

{#if showFundModal}
	<Modal {isMobile} isModalOpen on:backdropclicked={() => toggleFundModal(false)}>
		<div class="w-full rounded-t-2xl bg-background-alt px-4 sm:w-120 sm:!rounded-lg">
			<div class="flex items-center py-6 text-lg font-normal">
				<div class="flex-1 text-title">Why this fund?</div>
				<WMSIcon
					name="cross-circle"
					class="hidden cursor-pointer sm:block"
					on:click={() => toggleFundModal(false)}
					width={24}
					height={24}
				/>
			</div>
			<div class="pb-6 text-sm text-body">
				<p>
					Based on your asset allocation, investing in {schemeDetails?.subcategoryName?.toLowerCase() ===
					'small cap fund'
						? 'a'
						: 'an'}
					<b
						>{schemeDetails?.subcategoryName?.toLowerCase() === 'small cap fund'
							? 'Small Cap Fund'
							: 'Index Fund'}</b
					> will enhance the performance of your portfolio.
				</p>
				{#if schemeDetails?.subcategoryName?.toLowerCase() === 'small cap fund'}
					<p class="mt-4">Small cap funds invest in companies with market cap less than 5000 Cr.</p>
					<p class="mt-4">Benefits of small cap funds:</p>
					<ul class="ml-4 mt-4 list-inside list-disc">
						<li>High growth potential and rapid appreciation.</li>
						<li>Invest in small companies across sectors.</li>
						<li>Potential of undervalued opportunities.</li>
					</ul>
				{:else}
					<p class="mt-4">
						Index funds invest in the top 50 stocks according to the Nifty 50 index.
					</p>
					<p class="mt-4">Benefits of index funds:</p>
					<ul class="ml-4 mt-4 list-inside list-disc">
						<li>High growth with diversified portfolio.</li>
						<li>Invest in top 50 companies of India.</li>
						<li>Become part of Bharat's growth story.</li>
					</ul>
				{/if}
			</div>
		</div>
	</Modal>
{/if}
