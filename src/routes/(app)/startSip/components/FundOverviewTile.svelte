<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { createEventDispatcher } from 'svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { WMSIcon } from 'svelte-components';
	import { modifiedGoto } from '$lib/utils/goto';

	export let schemes: WeeklyTopSchemesEntity;
	export let clazz = '';
	export let index: number;
	export let schemeLogoSize = 'xs';
	export let schemeLogoClass = '';
	export let headingClass = '';
	export let showBadge = false;
	let dispatch = createEventDispatcher();

	function gotoSchemeDetails() {
		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			schemes?.schemeName,
			schemes?.isin,
			schemes?.schemeCode
		)}?orderpad=INVEST&params=${encodeObject({
			paymentMandatory: true
		})}`;
		modifiedGoto(schemeDetailsPath);
		dispatch('onCardClick');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section on:click={gotoSchemeDetails} class={`flex cursor-pointer flex-col px-1 py-2 ${clazz}`}>
	<div class="flex w-full items-start justify-between">
		<div class="flex flex-row">
			<div>
				<SchemeLogo
					src={schemes?.logoUrl}
					alt={schemes?.schemeName}
					size={schemeLogoSize}
					class={schemeLogoClass}
					lazy={index > 1 ? 'lazy' : 'eager'}
				/>
			</div>
			<div class:self-center={!showBadge}>
				<h3
					class="line-clamp-2 whitespace-normal text-sm font-medium text-title md:text-sm {headingClass}"
				>
					{schemes?.schemeName}
				</h3>
				{#if showBadge}
					<span
						class="rounded bg-tint12-secondary-alt p-1 text-[10px] font-normal text-secondary-alt"
						>Top Rated</span
					>
				{/if}
			</div>
		</div>
		<div class="ml-1">
			<WMSIcon
				name="arrow-next-circle-filled"
				circleFill="var(--BACKGROUND-ALT)"
				arrowFill="var(--BODY)"
				width={24}
				height={24}
			/>
		</div>
	</div>

	<div class="mx-11 mt-2 flex w-[204px] flex-col">
		<div
			class="grid grid-cols-2 flex-row justify-between rounded-t-lg opacity-[.99] md:max-w-[204px]"
		>
			<div class="flex flex-col items-start">
				<p class="mb-1 text-xs font-normal text-body">Min. SIP Amount</p>
				<p class="text-sm font-medium text-title">
					₹{addCommasToAmountString(schemes?.minSipAmount?.toString()) || schemes?.minSipAmount}
				</p>
			</div>
			<div class="flex flex-col items-end">
				<p class="mb-1 text-xs font-normal text-body">3Y Returns</p>
				<div class="flex flex-row items-center">
					<p class="text-xs font-normal text-title">
						<span class="text-sm font-medium {schemes?.returns3yr > 0 ? 'text-buy' : 'text-title'}"
							>{schemes?.returns3yr?.toFixed(2)}% p.a.</span
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
