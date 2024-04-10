<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PortfolioCardInvestment from '$components/PortfolioCards/PortfolioCardInvestment.svelte';
	import ClevertapNudgeComponent from '$components/clevertap/ClevertapNudgeComponent.svelte';
	import { ctNudgeStore } from '$lib/stores/CtNudgeStore';
	import type { IOPtimsiePortfolioData, InvestmentEntity } from '$lib/types/IInvestments';
	import { createEventDispatcher } from 'svelte';
	import type { PageData } from '../../$types';
	import { fundForYouClickAnalytics } from '../../../analytics';
	import InvestmentOrders from '../../InvestmentOrders.svelte';
	import OptimisePortfolioCard from '../OptimisePortfolioCard.svelte';
	import { appStore } from '$lib/stores/SparkStore';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { onMount } from 'svelte';
	import PortfolioCardLoader from '$components/PortfolioCards/PortfolioCardLoader.svelte';

	export let data: PageData;
	let familyPortfolioSummary;
	let isFamilyPortfolio = false;
	let logoUrl = '';

	let optimisePorfolioData: IOPtimsiePortfolioData = {
		isin: '',
		schemeCode: '',
		schemeName: '',
		logoUrl: ''
	};
	let holdings: Array<InvestmentEntity>;
	$: isMobile = $page?.data?.deviceType?.isMobile;
	let dispatch = createEventDispatcher();

	const toggleXirrModal = () => {
		dispatch('showXirr');
	};
	const toggleOptimisePorfolioCard = () => {
		const investmentSummary = data?.investementSummary;
		fundForYouClickAnalytics({
			'Current Value': investmentSummary?.currentValue,
			'Total Investment': investmentSummary?.investedValue,
			'Overall Gain': `${investmentSummary?.returnsValue}(${investmentSummary?.returnsAbsolutePer}%)`,
			'Todays Loss': `${investmentSummary?.previousDayReturns}(${investmentSummary?.previousDayReturnPercentage}%)`,
			'Fund Name': holdings?.filter((holding) => {
				return {
					'Fund Name': holding?.schemeName,
					'Current Value': holding?.currentValue,
					'Total Investment': holding?.investedValue,
					'Overall Gain': `${holding?.returnsValue}(${holding?.returnsAbsolutePer}%)`
				};
			})
		});
		dispatch('openOptimisePortfolio');
	};

	isFamilyPortfolio = appStore?.isFamilyPortfolioSelected($profileStore?.clientId);

	let isFamilyPortfolioDataFetched = false;

	const getFamilyPortfolioSummary = async () => {
		isFamilyPortfolioDataFetched = false;
		const query = appStore?.getSelectedLinkedMembersQuery();
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/summary?xirr=true`;
		const res = await useFetch(
			url,
			{
				headers: {
					'X-FOR-MEMBER': query
				}
			},
			fetch
		);
		if (res?.ok) {
			familyPortfolioSummary = res?.data?.data?.summary;
		}
		isFamilyPortfolioDataFetched = true;
	};

	onMount(async () => {
		let optimizedData = await data?.api?.getOptimisePortfolioData;
		optimisePorfolioData = optimizedData?.recommendedScheme?.[0];
		let investmentData = await data?.api?.investment;
		logoUrl =
			investmentData?.data?.holdings?.find((x: { sipEnabled: boolean }) => {
				return x.sipEnabled === true;
			})?.logoUrl || '';
		if (isFamilyPortfolio) {
			getFamilyPortfolioSummary();
		}
	});
</script>

<!-- Right Side Contents -->
<section class="col-span-1 row-start-1 sm:col-span-1 sm:col-start-2 sm:row-span-3">
	<section class="sm:sticky sm:top-0">
		<!-- Portfolio cards: All scenarios -->
		<article class="mb-2 overflow-hidden sm:mb-0">
			{#if isFamilyPortfolio && !isFamilyPortfolioDataFetched}
				<PortfolioCardLoader hideBottomLoader={isFamilyPortfolio} />
			{:else}
				<PortfolioCardInvestment
					onInfoClick={toggleXirrModal}
					investmentSummary={isFamilyPortfolio
						? familyPortfolioSummary || {}
						: data.investementSummary}
				/>
			{/if}
			{#if $ctNudgeStore?.kv?.topic === 'mf_invdash_inpage1_type_d' || (['mf_invdash_bottomsticky_type_b', 'mf_invdash_bottomsticky_type_c', 'mf_invdash_bottomsticky_type_d'].includes($ctNudgeStore?.kv?.topic) && !isMobile)}
				<ClevertapNudgeComponent
					class="mt-2 w-full items-center rounded-lg"
					data={$ctNudgeStore}
					on:onCTAClicked={(e) => goto(e.detail.url)}
				/>
			{/if}
		</article>
		{#if optimisePorfolioData?.schemeCode && optimisePorfolioData?.schemeName && optimisePorfolioData?.isin}
			<article class="mt-2 hidden sm:block">
				<OptimisePortfolioCard
					currentSchemeLogo={optimisePorfolioData?.firstSchemeLogoUrl || ''}
					peopleInvested={optimisePorfolioData?.clientWithMultipleSips}
					on:click={toggleOptimisePorfolioCard}
				/>
			</article>
		{/if}
		<!-- Order cards: Visible only in desktop and tablet -->
		{#if !isMobile}
			<article class="mt-5">
				<InvestmentOrders />
			</article>
		{/if}
	</section>
</section>
