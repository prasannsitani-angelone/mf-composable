<script lang="ts">
	import { Overlay, WMSIcon } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import TrendingCarouselItems from '$components/MostBought/TrendingCarouselItems.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails.js';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { createEventDispatcher } from 'svelte';
	import { externalInvestmentMappedFundClickEvent } from '../analytics';

	/**
	 * {
	 *       "isin": "INF00XX01408",
	 *       "schemeCode": "ITELD1-DP",
	 *       "schemeName": "ITI Long Term Equity Fund Direct Plan IDCW Payout",
	 *       "logoUrl": "https://d3usff6y6s0r8b.cloudfront.net/iti_mutual_angel.svg"
	 *     }
	 */
	export let mappingScheme: SchemeDetails;
	export let externalIsin: string;
	const { schemeName, isin, schemeCode, schemePlan } = mappingScheme;
	const dispatch = createEventDispatcher();

	const onInvestMoreClicked = () => {
		goto(`${base}/schemes/${normalizeFundName(schemeName, isin, schemeCode)}?orderpad=INVEST`);

		externalInvestmentMappedFundClickEvent({
			isin: externalIsin,
			mappedisin: mappingScheme.isin
		});
	};
</script>

<Overlay containerClass="justify-end sm:!justify-center" on:backdropclicked>
	<article
		class="flex w-full flex-col items-center rounded-t-2xl bg-background-alt px-4 pt-6 sm:w-120 sm:rounded-lg sm:p-8"
	>
		<p class="w-full text-center text-base font-normal text-title">
			{#if 'direct' === schemePlan.toLowerCase()}
				Earn more returns with Angel One
			{:else}
				Invest with Angel One
			{/if}
		</p>
		<p class="mb-6 text-center text-sm font-normal text-title">
			{#if 'direct' === schemePlan.toLowerCase()}
				Zero-commission plan is available<span><br /></span>for this mutual fund
			{:else}
				Currently available plan for this mutual fund
			{/if}
		</p>

		<WMSIcon
			on:click={() => dispatch('backdropclicked')}
			class="absolute right-0 top-0 m-4 hidden cursor-pointer sm:block"
			name="cross-circle"
		/>

		<TrendingCarouselItems
			clazz="p-3 bg-background-alt shadow-csm mb-4"
			schemes={mappingScheme}
			index={0}
			disableRedirection
		>
			<svelte:fragment slot="topRightSection">
				<section class="ml-1 flex flex-col items-end">
					{#if mappingScheme?.returns3yr > 0}
						<div class="w-20 text-right text-xs font-normal text-body">Returns p.a</div>
						<article class="mt-0.5 flex items-center">
							<WMSIcon class="mr-1 mt-1 h-4 w-3" name="green-uparrow-trending-fund" />
							<div class="text-base font-bold text-title">
								{mappingScheme?.returns3yr?.toFixed(2)}%
							</div>
						</article>
					{:else}
						<div class="w-20 text-right text-xs font-normal text-body" />
					{/if}
				</section>
			</svelte:fragment>

			<svelte:fragment slot="detailsRight">
				<div />
			</svelte:fragment>
			<svelte:fragment slot="detailsFooter">
				<div />
			</svelte:fragment>
			<svelte:fragment slot="detailsFooterDescription">
				<div />
			</svelte:fragment>
			<svelte:fragment slot="details">
				<div />
			</svelte:fragment>
		</TrendingCarouselItems>
		<ButtonMedium
			class={`!disabled:text-disabled w-full rounded disabled:!bg-border`}
			onClick={onInvestMoreClicked}
		>
			INVEST MORE
		</ButtonMedium>

		<section class="mx-3 mb-3 flex justify-center text-1xs font-normal text-title sm:mb-0">
			<article class="flex items-center justify-center px-6 pt-2.5">
				<WMSIcon class="mr-1" width={12} height={12} name="info-in-circle-dark" />
				You will be investing with Angel One
			</article>
		</section>
	</article>
</Overlay>
