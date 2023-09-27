<script lang="ts">
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName.js';
	import { goto } from '$app/navigation';
	import type { CategorySubOptionsEntity } from '$lib/types/IDiscoverFunds';
	import { WMSIcon } from 'svelte-components';
	import { encodeObject } from '$lib/utils/helpers/params';

	export let schemeData: CategorySubOptionsEntity;
	export let parentCategoryId: string;
	const MAX_RETURN_FILTER_ID = '107';

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
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<article
	class="cursor-pointer rounded-lg border border-grey-line bg-white p-3 shadow-none ${$$props.class}"
	on:click={goToFundDetailsPage}
>
	<div class="flex flex-row justify-between">
		<div class="flex flex-row">
			<div
				class="mr-3 flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full shadow-csm"
			>
				<img src={schemeData?.logoUrl} alt="schemelogo" />
			</div>
			<div class="mr-3 text-sm font-medium text-black-title">{schemeData.schemeName}</div>
		</div>
		{#if schemeData?.returns3yr > 0}
			<div class="whitespace-nowrap">
				<div class="text-xs font-medium text-grey-body">Returns p.a</div>
				<div class="text-right text-base font-medium text-black-title">
					{schemeData?.returns3yr?.toFixed(1)}%
				</div>
			</div>
		{/if}
	</div>
	{#if schemeData?.textMessage}
		<div class="mt-2 flex flex-row items-center">
			{#if parentCategoryId === MAX_RETURN_FILTER_ID}
				<WMSIcon name="graph-up" class="mr-2 p-1" />
			{:else}
				<WMSIcon name="people-icon" class="mr-2 p-1" />
			{/if}
			<div class="text-xs text-black-title">
				{schemeData.textMessage}
			</div>
		</div>
	{/if}
</article>
