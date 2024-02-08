<script lang="ts">
	import { versionStore } from '$lib/stores/VersionStore';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import SchemeLogo from './SchemeLogo.svelte';
	import AddToCart from './AddToCart.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { createEventDispatcher } from 'svelte';
	import { base } from '$app/paths';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { goto } from '$app/navigation';
	import ChipOverview from './ChipOverview.svelte';
	import GreenUpArrowTrendingFund from '$lib/images/GreenUpArrowTrendingFund.svg';
	import PeopleIconGrey from '$lib/images/PeopleIconGrey.svg';
	import AmountText from './AmountText.svelte';

	let schemes: WeeklyTopSchemesEntity | ExploreFundsOptions | SchemeDetails;
	let showLogo = true;
	let disableRedirection = false;
	let showTopRated = false;
	let enableVariant = false;
	let dispatch = createEventDispatcher();
	function gotoSchemeDetails() {
		if (disableRedirection) {
			return;
		}

		const params =
			enableVariant && $versionStore.version === 'B'
				? { paymentMandatory: true }
				: { investmentType: 'SIP', paymentMandatory: true };
		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			schemes?.schemeName,
			schemes?.isin,
			schemes?.schemeCode
		)}?orderpad=INVEST&params=${encodeObject(params)}`;
		goto(schemeDetailsPath);
		dispatch('onCardClick');
	}
	export { schemes, showLogo, disableRedirection, showTopRated, enableVariant };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={gotoSchemeDetails}
	on:keydown={gotoSchemeDetails}
	class={`flex cursor-pointer flex-col rounded-lg border p-3 shadow-csm ${$$props.class}`}
>
	<div class="mb-3 flex flex-row">
		<div class="h-[20px] flex-1 p-[2px]">
			<slot name="chip-overview">
				<ChipOverview
					class="!text-1xs sm:!mb-0"
					headingPrimaryClass="!mr-1"
					roundedClass="!mr-1"
					headingSecondaryClass="!mr-1"
					headingPrimary={schemes?.categoryName}
					headingSecondary={schemes?.subcategoryName}
				/>
			</slot>
		</div>
		<div class="relative w-16">
			<slot name="topRightSection">
				{#if (schemes?.sortBy2 > 0 && schemes?.sortBy2 < 3) || showTopRated}
					<div class="bottom absolute inset-0" />
					<div class="top absolute inset-0" />
					<div
						class="absolute right-1 flex h-[20px] items-center text-1xs font-normal text-background-alt"
					>
						Top Rated
					</div>
				{/if}
			</slot>
		</div>
	</div>
	<div class="flex flex-row items-start">
		<section class="flex items-center">
			{#if showLogo}
				<SchemeLogo src={schemes?.logoUrl} alt={schemes?.schemeName} />
			{/if}
			<p class="line-clamp-2 whitespace-normal text-sm font-normal text-title md:text-sm">
				{schemes?.schemeName}
			</p>
		</section>
		<div class="flex-1" />
		<slot name="titleRightSection">
			<AddToCart
				on:onCartClick
				class="m-0 ml-1 mt-[-10px] p-0"
				scheme={schemes}
				entryPoint="PopularFunds"
			/>
		</slot>
	</div>
	<div class="mt-3 flex flex-col">
		<div class="flex flex-row divide-x divide-[#C7CDEB] rounded bg-[#F1F3FC] px-4 py-2">
			<slot name="detailsLeft">
				<div class="flex w-6/12 flex-col items-start">
					<p class="text-xs text-[#515151]">Min. SIP Amount</p>
					<p class="text-base font-medium">
						<AmountText amount={schemes?.minSipAmount || 0} />
					</p>
				</div>
			</slot>
			<slot name="detailsRight">
				<div class="flex w-6/12 flex-col items-end">
					<p class="text-xs text-[#515151]">Returns</p>
					<div class="flex flex-row items-center">
						<img
							src={GreenUpArrowTrendingFund}
							class="mr-1 mt-1 h-3 w-2.5"
							decoding="async"
							alt="Trending Funds Up Arrow"
							width="10"
							height="12"
						/>
						<p class="text-xs font-normal">
							<span class="text-base font-normal">{schemes?.returns3yr?.toFixed(2)}%</span> p.a
						</p>
					</div>
				</div>
			</slot>
		</div>

		<slot name="detailsFooter">
			{#if schemes?.noOfClientInvested > 0}
				<div class="mt-3 flex flex-row items-center">
					<slot name="detailsFooterIcon">
						<img
							src={PeopleIconGrey}
							class="mr-2 p-1"
							decoding="async"
							alt="Number of people invested"
							width="24"
							height="24"
						/>
					</slot>

					<slot name="detailsFooterDescription">
						<p class="text-xs text-body">
							<span class=" font-medium">
								{addCommasToAmountString(schemes?.noOfClientInvested)}
							</span>
							people have invested in this fund
						</p>
					</slot>
				</div>
			{/if}
		</slot>
	</div>

	<slot name="cardFooter" />
</div>

<style>
	.bottom {
		border-bottom: 20px solid #1ec7b666;
		border-left: 10px solid transparent;
	}
	.top {
		border-top: 20px solid #581dbe99;
		border-left: 10px solid transparent;
	}
</style>
