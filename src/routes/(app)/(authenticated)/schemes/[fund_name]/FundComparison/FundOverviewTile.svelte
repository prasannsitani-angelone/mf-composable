<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import type { OtherSchemeEntityOrSchemeInfoEntity } from '$components/Scheme/types';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { createEventDispatcher } from 'svelte';
	import { BtnVariant, WMSIcon } from 'svelte-components';

	let schemeDetails: SchemeDetails | OtherSchemeEntityOrSchemeInfoEntity;
	let isPrimary = false;
	let isRemovable = false;
	let showCompact = false;
	let showCTA = false;

	const dispatch = createEventDispatcher();

	const onRemoveFundClick = () => {
		dispatch('removeFund', { schemeDetails });
	};

	const onAddFundClick = () => {
		dispatch('addFund');
	};
	const onInvestClick = () => {
		dispatch('invest', { schemeDetails });
		goto(
			`${base}/${normalizeFundName(
				schemeDetails?.schemeName,
				schemeDetails?.isin,
				schemeDetails?.schemeCode,
				'schemes'
			)}`
		);
	};

	export { schemeDetails, isPrimary, isRemovable, showCompact, showCTA };
</script>

<article class="flex h-full w-full flex-col items-start">
	{#if schemeDetails?.isin}
		<div class="flex w-full justify-between">
			<SchemeLogo src={schemeDetails?.logoUrl} size="xs" class="!mr-1" />
			{#if isPrimary}
				<div class="mr-auto self-start rounded-full bg-sell px-[6px] py-[2px]">
					<p class="text-[10px] font-medium text-background-alt">This Fund</p>
				</div>
			{/if}
			{#if isRemovable}
				<WMSIcon
					name="trash-icon-custom"
					stroke="#D64D4D"
					width={18}
					height={18}
					class="ml-auto mt-1 justify-self-end md:cursor-pointer"
					on:click={onRemoveFundClick}
				/>
			{/if}
		</div>
		<p
			class="my-3 flex w-full flex-1 truncate text-xs font-medium text-title md:text-sm"
			id="title-truncate"
		>
			{schemeDetails?.schemeName}
		</p>
		{#if !showCompact}
			<div class="pb-3">
				<p class="text-[11px] font-normal text-body">3Y Returns</p>
				<p class="text-xs font-normal text-title">{schemeDetails?.returns3yr?.toFixed(2)}%</p>
			</div>
			<div class="pb-3">
				<p class="text-[11px] font-normal text-body">Min. SIP</p>
				<p class="text-xs font-normal text-title">₹{schemeDetails?.minSipAmount || '0'}</p>
			</div>
			<div class="pb-3">
				<p class="text-[11px] font-normal text-body">No. of Investors</p>
				<p class="text-xs font-normal text-title">
					{addCommasToAmountString(schemeDetails?.noOfClientInvested)}
				</p>
			</div>
		{/if}
		{#if showCTA}
			<Button variant={BtnVariant.Contained} size="sm" class="mt-auto px-6" onClick={onInvestClick}>
				INVEST
			</Button>
		{/if}
	{:else}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<secton
			class="flex h-full min-h-[126px] w-full flex-col items-center justify-center gap-2 md:cursor-pointer"
			on:click={onAddFundClick}
		>
			<WMSIcon name="add-outline" height={20} width={20} />
			<p class="text-center text-xs font-medium text-title">Add Fund <br /> to Compare</p>
		</secton>
	{/if}
</article>

<style>
	#title-truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: initial;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
