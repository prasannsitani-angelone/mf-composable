<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import type { ScreenedSchemes } from '$lib/types/Screener';
	import { modifiedGoto } from '$lib/utils/goto';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { WMSIcon, addCommasToAmountString } from 'svelte-components';
	import { handleCarouselItemClickAnalytics } from './analytics';
	import { getEventMetaData } from './utils';

	export let scheme: ScreenedSchemes;
	export let index: number;
	export let title: string;

	$: isMobile = $page.data.deviceType.isMobile || false;

	const handleSchemeClick = async () => {
		const { schemeName, isin, schemeCode } = scheme;
		const metaData = getEventMetaData(index, title, scheme);
		handleCarouselItemClickAnalytics(metaData);

		await modifiedGoto(
			`${base}/${normalizeFundName(schemeName, isin, schemeCode, 'schemes')}?orderpad=INVEST`
		);
	};
</script>

<div
	class={`flex cursor-pointer flex-col rounded-lg border bg-background-alt ${
		index > 0 && !isMobile ? 'ml-3' : ''
	}`}
	role="button"
	tabindex="0"
	on:click={handleSchemeClick}
	on:keypress={handleSchemeClick}
>
	<div class="flex flex-col">
		<slot name="details">
			<div
				class="relative mb-2 mt-2 w-full overflow-hidden px-3 {scheme?.returns3yr
					? ''
					: 'rounded-b'}"
			>
				<div class="flex flex-row items-center justify-between rounded-t-lg opacity-[.99]">
					<slot name="detailsLeft">
						<div class="flex flex-0.7 flex-row items-center">
							<img
								src={scheme.logoUrl}
								alt={`${scheme?.schemeName} logo`}
								class="rounded-full bg-white"
								loading={index > 0 ? 'lazy' : 'eager'}
								fetchpriority={index > 0 ? 'low' : 'high'}
							/>
							<h3 class="ml-3 line-clamp-2 text-sm text-sm font-medium text-title">
								{scheme.schemeName}
							</h3>
						</div>
					</slot>
					<slot name="detailsRight">
						<div class="flex flex-0.3 flex-col items-end">
							<p class="mb-1 text-xs font-normal text-body">3Y Returns</p>
							<div class="flex flex-row items-center">
								<p class="text-xs font-normal text-title">
									<span
										class="text-sm font-medium {scheme?.minSipAmount > 0
											? 'text-buy'
											: 'text-title'}">{scheme?.returns3yr?.toFixed(2)}% p.a</span
									>
								</p>
							</div>
						</div>
					</slot>
				</div>
			</div>
		</slot>
		{#if scheme?.noOfClientInvested}
			<slot name="detailsFooter">
				<div class="flex flex-row items-center rounded-b bg-background px-3 py-1">
					<slot name="detailsFooterIcon">
						<WMSIcon
							fill="var(--BODY)"
							name="people-icon"
							class="mr-1 p-1 pl-0"
							decoding="async"
							alt="Number of people invested"
							width={24}
							height={24}
						/>
					</slot>

					<slot name="detailsFooterDescription">
						<p class="text-xs text-body">
							<span class=" font-medium">
								{addCommasToAmountString(scheme?.noOfClientInvested)}
							</span>
							people invested in this portfolio
						</p>
					</slot>
				</div>
			</slot>
		{/if}
	</div>
</div>
