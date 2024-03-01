<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import AddToCart from '$components/AddToCart.svelte';
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { createEventDispatcher } from 'svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { WMSIcon } from 'svelte-components';
	import { goto } from '$app/navigation';

	export let schemes: WeeklyTopSchemesEntity;
	export let clazz = '';
	export let index;
	export let disableRedirection = false;
	export let schemeLogoSize = 'sm';
	export let schemeLogoClass = '';
	export let headingClass = '';
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
			paymentMandatory: true
		})}`;
		goto(schemeDetailsPath);
		dispatch('onCardClick');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={gotoSchemeDetails} class={`flex cursor-pointer flex-col ${clazz}`}>
	<div class="mb-1 flex flex-row items-start px-2">
		<slot name="topLeftSection">
			<SchemeLogo
				src={schemes?.logoUrl}
				alt={schemes?.schemeName}
				size={schemeLogoSize}
				class={schemeLogoClass}
				lazy={index > 1 ? 'lazy' : 'eager'}
			/>
			<h3
				class="line-clamp-2 self-center whitespace-normal text-sm font-normal text-title md:text-sm {headingClass}"
			>
				{schemes?.schemeName}
			</h3>
		</slot>
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
				<div class="grid grid-cols-2 flex-row justify-between rounded-t-lg px-2 opacity-[.99]">
					<slot name="detailsLeft">
						<div class="flex flex-col items-start">
							<p class="mb-1 text-xs font-normal text-body">Min. SIP Amount</p>
							<p class="text-sm font-medium text-title">
								₹{addCommasToAmountString(schemes?.minSipAmount?.toString()) ||
									schemes?.minSipAmount}
							</p>
						</div>
					</slot>
					<slot name="detailsRight">
						<div class="flex flex-col items-end">
							<p class="mb-1 text-xs font-normal text-body">3Y Returns</p>
							<div class="flex flex-row items-center">
								<p class="text-xs font-normal text-title">
									<span
										class="text-sm font-medium {schemes?.returns3yr > 0
											? 'text-buy'
											: 'text-title'}">{schemes?.returns3yr?.toFixed(2)}%</span
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
				<div class="flex flex-row items-center rounded-b px-3 py-2">
					<slot name="detailsFooterIcon">
						<WMSIcon
							fill="var(--BODY)"
							name="people-icon"
							class="mr-2 p-1"
							decoding="async"
							alt="Number of people invested"
							width={24}
							height={24}
						/>
					</slot>

					<slot name="detailsFooterDescription">
						<p class="text-xs text-body">
							<span class=" font-medium">
								{addCommasToAmountString(schemes?.noOfClientInvested)}
							</span>
							people invested in this fund
						</p>
					</slot>
				</div>
			{/if}
		</slot>
	</div>

	<slot name="cardFooter" />
</div>
