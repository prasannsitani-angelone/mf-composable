<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import AddToCart from '$components/AddToCart.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { WMSIcon } from 'wms-ui-component';
	import { createEventDispatcher } from 'svelte';

	export let schemes: WeeklyTopSchemesEntity;
	export let clazz = '';
	export let index;
	let dispatch = createEventDispatcher();

	function gotoSchemeDetails() {
		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			schemes?.schemeName,
			schemes?.isin,
			schemes?.schemeCode
		)}`;
		goto(schemeDetailsPath);
		dispatch('onCardClick');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={gotoSchemeDetails} class={`flex cursor-pointer flex-col ${clazz}`}>
	<div class="mb-3 flex flex-row items-start">
		<SchemeLogo
			src={schemes?.logoUrl}
			alt={schemes?.schemeName}
			class="border-line-grey"
			lazy={index > 1 ? 'lazy' : 'eager'}
		/>
		<h3 class="line-clamp-2 whitespace-normal text-sm font-medium text-black-title md:text-sm">
			{schemes?.schemeName}
		</h3>
		<div class="flex-1" />
		<AddToCart
			on:onCartClick
			class="m-0 ml-1 mt-[-10px] p-0"
			scheme={schemes}
			entryPoint="PopularFunds"
		/>
	</div>

	<div class="flex flex-col">
		<div class="relative w-full overflow-hidden">
			<WMSIcon name="trending-funds" class="absolute h-full w-full" />
			<div class=" flex flex-row rounded-t-lg p-2 opacity-[.99]">
				<div class="flex flex-col items-start">
					<p class="text-xs font-normal">Min. SIP Amount</p>
					<p class="text-base font-medium">
						₹ {addCommasToAmountString(schemes?.minSipAmount?.toString()) || schemes?.minSipAmount}
					</p>
				</div>
				<div class="flex-1" />
				<div class="flex flex-col items-end">
					<p class="text-xs font-normal">3 Year Return</p>
					<div class="flex flex-row items-center">
						<WMSIcon class="mr-1 h-3 w-2.5" name="green-uparrow-trending-fund" />
						<p class="text-xs font-normal">
							<span class="text-base font-medium">{schemes?.returns3yr}%</span> p.a
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-row items-center rounded-b-lg bg-[#D1D8F6] p-2">
			<WMSIcon class="mr-2 p-1" name="people-icon" />
			<p class="text-xs">
				<span class=" font-semibold"> {addCommasToAmountString(schemes?.noOfClientInvested)} </span>
				people have invested in this fund
			</p>
		</div>
	</div>
</div>
