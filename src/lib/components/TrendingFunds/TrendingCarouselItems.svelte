<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import AddToCart from '$components/AddToCart.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import GreenUpArrowTrendingFund from '$lib/images/GreenUpArrowTrendingFund.svg';
	import PeopleIcon from '$lib/images/PeopleIcon.svg';
	import { createEventDispatcher } from 'svelte';
	import { encodeObject } from '$lib/utils/helpers/params';

	export let schemes: WeeklyTopSchemesEntity;
	export let clazz = '';
	export let index;
	export let disableRedirection = false;
	let dispatch = createEventDispatcher();

	function gotoSchemeDetails() {
		if (disableRedirection) {
			return;
		}

		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			schemes?.schemeName,
			schemes?.isin,
			schemes?.schemeCode
		)}?orderpad=INVEST&params=${encodeObject({
			investmentType: 'SIP',
			paymentMandatory: true
		})}`;
		goto(schemeDetailsPath);
		dispatch('onCardClick');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={gotoSchemeDetails} class={`flex cursor-pointer flex-col ${clazz}`}>
	<div class="flex flex-row items-start">
		<SchemeLogo
			src={schemes?.logoUrl}
			alt={schemes?.schemeName}
			class="border-line-grey"
			lazy={index > 1 ? 'lazy' : 'eager'}
		/>
		<h3 class="line-clamp-2 whitespace-normal text-sm font-normal text-black-title md:text-sm">
			{schemes?.schemeName}
		</h3>
		<div class="flex-1" />
		<slot name="topRightSection">
			<AddToCart
				on:onCartClick
				class="m-0 ml-1 mt-[-10px] p-0"
				scheme={schemes}
				entryPoint="PopularFunds"
			/>
		</slot>
	</div>
	<div class="flex flex-col">
		<slot name="details">
			<div
				class="relative mt-3 w-full overflow-hidden {schemes?.noOfClientInvested
					? ''
					: 'rounded-b'}"
			>
				<img
					src="{base}/images/TrendingFundsBackground.svg"
					class="absolute h-full w-full"
					decoding="async"
					alt="Trending Funds"
				/>
				<div class=" flex flex-row rounded-t-lg p-2 opacity-[.99]">
					<slot name="detailsLeft">
						<div class="flex flex-col items-start">
							<p class="text-xs font-normal">Min. SIP Amount</p>
							<p class="text-base font-medium">
								₹ {addCommasToAmountString(schemes?.minSipAmount?.toString()) ||
									schemes?.minSipAmount}
							</p>
						</div>
					</slot>
					<div class="flex-1" />
					<slot name="detailsRight">
						<div class="flex flex-col items-end">
							<p class="text-xs font-normal">3 Year Returns</p>
							<div class="flex flex-row items-center">
								<img
									src={GreenUpArrowTrendingFund}
									class="mr-1 h-3 w-2.5"
									decoding="async"
									alt="Trending Funds Up Arrow"
									width="10"
									height="12"
								/>
								<p class="text-xs font-normal">
									<span class="text-base font-medium">{schemes?.returns3yr?.toFixed(2)}%</span> p.a
								</p>
							</div>
						</div>
					</slot>
				</div>
			</div>
		</slot>
		<slot name="detailsFooter">
			{#if schemes?.noOfClientInvested}
				<div class="flex flex-row items-center rounded-b bg-[#D1D8F6] p-2">
					<slot name="detailsFooterIcon">
						<img
							src={PeopleIcon}
							class="mr-2 p-1"
							decoding="async"
							alt="Number of people invested"
							width="24"
							height="24"
						/>
					</slot>

					<slot name="detailsFooterDescription">
						<p class="text-xs">
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
