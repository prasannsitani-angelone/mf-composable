<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import AddToCart from '$components/AddToCart.svelte';
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import PeopleIcon from '$lib/images/PeopleIcon.svg';
	import { createEventDispatcher } from 'svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { modifiedGoto } from '$lib/utils/goto';

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
		modifiedGoto(schemeDetailsPath);
		dispatch('onCardClick');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={gotoSchemeDetails} class={`flex cursor-pointer flex-col ${clazz}`}>
	<div class="mb-3 flex flex-row items-start px-3">
		<SchemeLogo
			size="sm"
			src={schemes?.logoUrl}
			alt={schemes?.schemeName}
			lazy={index > 1 ? 'lazy' : 'eager'}
		/>
		<h3
			class="line-clamp-2 self-center whitespace-normal text-sm font-normal text-black-title md:text-sm"
		>
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
	<div class="flex flex-col border-t">
		<slot name="details">
			<div
				class="relative mt-2 w-full overflow-hidden px-1 {schemes?.noOfClientInvested
					? ''
					: 'rounded-b'}"
			>
				<div
					class="grid grid-cols-2 flex-row justify-between divide-x rounded-t-lg p-2 opacity-[.99]"
				>
					<slot name="detailsLeft">
						<div class="flex flex-col items-start">
							<p class="text-xs font-normal">Min. SIP Amount</p>
							<p class="text-base font-medium">
								₹ {addCommasToAmountString(schemes?.minSipAmount?.toString()) ||
									schemes?.minSipAmount}
							</p>
						</div>
					</slot>
					<slot name="detailsRight">
						<div class="flex flex-col items-end">
							<p class="text-xs font-normal">3 Year Returns</p>
							<div class="flex flex-row items-center">
								<p class="text-xs font-normal">
									<span
										class="text-base font-medium {schemes?.returns3yr > 0
											? 'text-green-amount'
											: 'text-black-bolder'}">{schemes?.returns3yr?.toFixed(2)}%</span
									>
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
