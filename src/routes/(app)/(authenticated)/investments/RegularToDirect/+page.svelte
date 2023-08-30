<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import OverlayLoading from '$components/OverlayLoading.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { regularToDirectFundsStore } from '$lib/stores/RegularToDirectFundStore';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { useFetch } from '$lib/utils/useFetch';
	import {
		SkeletonWrapper,
		WMSIcon,
		SkeletonRectangle,
		addCommasToAmountString
	} from 'svelte-components';

	export let data: import('./$types').PageData;

	let isLoading = false;

	const switchFund = async (scheme) => {
		regularToDirectFundsStore.reset();
		isLoading = true;
		const response = await useFetch(
			`${PUBLIC_MF_CORE_BASE_URL}/schemes/${scheme.isin}/${scheme.schemeCode}/mappings?purchaseAllowed=Y&switchAllowed=Y`
		);
		if (response.ok && response.status === 200) {
			const data = response?.data?.regularDirectScheme;
			const params = {
				isin: data?.[0]?.isin,
				schemeCode: data?.[0]?.schemeCode
			};
			await goto(
				`${base}/schemes/switch/${normalizeFundName(
					scheme.schemeName,
					scheme.isin,
					scheme.schemeCode
				)}?params=${encodeObject(params)}`
			);
		} else {
			await goto(
				`${base}/schemes/switch/${normalizeFundName(
					scheme.schemeName,
					scheme.isin,
					scheme.schemeCode
				)}`
			);
		}
	};
</script>

{#await data.api.regularSchemes}
	<SkeletonWrapper class="px-2 py-2.5">
		<SkeletonRectangle class="mb-2 flex h-80 w-full flex-col rounded-lg p-3 shadow-csm" />
		<div class="flex flex-col rounded-lg bg-white pt-4 shadow-csm">
			<div class="flex flex-row items-center border-b border-grey-line px-3 py-4">
				<SkeletonRectangle class="mr-1 h-9 w-9" />
				<SkeletonRectangle class="h-8 w-40" />
			</div>
			<div class="flex flex-row items-center border-b border-grey-line px-3 py-4">
				<SkeletonRectangle class="mr-1 h-9 w-9" />
				<SkeletonRectangle class="h-8 w-40" />
			</div>
		</div>
	</SkeletonWrapper>
{:then regularSchemes}
	<article class="grid grid-cols-[100%] gap-2 px-2 py-2.5 sm:grid-cols-[65%_35%] sm:gap-5">
		<section
			class="flex h-max flex-col rounded-lg bg-white p-3 shadow-csm sm:col-start-2 sm:row-start-1"
		>
			<div class="mb-2 text-center text-base font-medium text-black-title">
				Earn up to 1.5% more returns with your existing investments!
			</div>
			<div class="flex flex-row items-center bg-purple-light px-4 py-3">
				<WMSIcon name="announcement-purple" class="mr-3 h-6 w-6 min-w-[24px]" />
				<div class="text-xs text-black-title">
					Direct plans for mutual funds do not charge any commission/fees. These savings add up to
					more returns for you over time.
				</div>
			</div>
			<div class="mb-5 mt-10 flex w-full flex-row items-end">
				<div class="flex flex-1 flex-col items-center">
					<div class="mb-3 text-sm font-medium text-black-title">
						₹{addCommasToAmountString(regularSchemes.regularCumullativeAmount?.toString())}
					</div>
					<div class="h-12 w-8 bg-red-sell" />
					<div class="w-full border-b border-grey-line" />
					<div class="mt-3 text-xs text-grey-body">Regular Funds</div>
				</div>
				<div class="flex flex-1 flex-col items-center">
					<div class="mb-3 text-sm font-medium text-black-title">
						₹{addCommasToAmountString(regularSchemes.directCumullativeAmount?.toString())}
					</div>
					<div class="h-28 w-8 bg-blue-sell" />
					<div class="w-full border-b border-grey-line" />
					<div class="mt-3 text-xs text-grey-body">Direct Funds</div>
				</div>
			</div>
			<div class="text-center text-xs text-grey-body">
				Disclaimer: Projected values are based considering standard 10% CAGR of your funds, and an
				additional 1.5% returns for direct funds compounded for 10 years. Your actual returns may
				vary.
			</div>
		</section>
		<section class="h-max rounded-lg bg-white pt-4 shadow-csm sm:col-start-1 sm:row-start-1">
			<div class="px-3 text-base font-medium text-black-title">
				Funds with Available Direct Plans
			</div>

			<!-- svelte-ignore a11y-no-static-element-interactions -->
			{#each regularSchemes.schemes as scheme, index (index)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-row items-center justify-between border-b border-grey-line px-3 py-4 active:opacity-75"
					on:click={() => switchFund(scheme)}
				>
					<div class="flex flex-row items-center">
						<img class="mr-1 h-9 w-9" src={scheme.logoUrl} alt="Scheme Logo" />
						<div class="mr-1 text-sm font-medium text-black-title">{scheme.schemeName}</div>
					</div>
					<div class="flex flex-row items-center text-sm font-semibold text-blue-primary">
						<span>SWITCH</span>
						<WMSIcon name="right-arrow" class="h-6 w-6 min-w-[24px]" stroke="#3F5BD9" />
					</div>
				</div>
			{/each}
		</section>
	</article>
{/await}

{#if isLoading}
	<OverlayLoading />
{/if}
