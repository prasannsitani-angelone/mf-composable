<script lang="ts">
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName.js';
	import { goto } from '$app/navigation';
	import type { CategorySubOptionsEntity } from '$lib/types/IDiscoverFunds';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { createEventDispatcher } from 'svelte';
	import { WMSIcon } from 'svelte-components';
	export let schemeData: CategorySubOptionsEntity;
	export let parentCategoryId: string;
	const MAX_RETURN_FILTER_ID = '107';

	const dispatch = createEventDispatcher();

	const goToFundDetailsPage = async () => {
		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			schemeData?.schemeName,
			schemeData?.isin,
			schemeData?.schemeCode
		)}?orderpad=INVEST&params=${encodeObject({
			investmentType: 'SIP',
			paymentMandatory: true
		})}`;
		await goto(schemeDetailsPath);
		dispatch('subCategoryClicked', {
			subCategory: schemeData
		});
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<article
	class="cursor-pointer rounded-lg border border-grey-line bg-white p-3 pb-2 shadow-none ${$$props.class}"
	on:click={goToFundDetailsPage}
>
	<div class="flex flex-row justify-between">
		<div class="flex flex-row">
			<div
				class="mr-3 flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full shadow-csm"
			>
				<img src={schemeData?.logoUrl} alt="schemelogo" />
			</div>
			<div class="mr-3 line-clamp-2 self-center text-sm font-normal text-black-title">
				{schemeData.schemeName}
			</div>
		</div>
		{#if schemeData?.returns3yr > 0}
			<div class="whitespace-nowrap">
				<div class="text-xs font-normal text-grey-body">Returns p.a</div>
				<div class="text-right text-base font-normal text-black-title">
					{schemeData?.returns3yr?.toFixed(1)}%
				</div>
			</div>
		{/if}
	</div>
	{#if schemeData?.textMessage}
		<div class="mt-4 flex flex-row items-center">
			{#if parentCategoryId === MAX_RETURN_FILTER_ID}
				<WMSIcon name="graph-up" width={14} height={14} stroke="#6A7582" class="mr-2" />
			{:else}
				<WMSIcon name="people-icon" width={14} height={12} fill="#6A7582" class="mr-2" />
			{/if}
			<div class="text-xs font-normal text-grey-body">
				{schemeData.textMessage}
			</div>
		</div>
	{/if}
</article>
