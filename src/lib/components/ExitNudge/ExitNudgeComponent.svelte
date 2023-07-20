<script lang="ts">
	import Overlay from '$components/Overlay.svelte';
	import { onMount } from 'svelte';
	import { appStore } from '$lib/stores/SparkStore';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { base } from '$app/paths';
	import type { StartFirstSipNudgeType } from '$lib/types/INudge';
	import { userStore } from '$lib/stores/UserStore';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import AmountText from '$components/AmountText.svelte';
	import WMSIcon from '$components/WMSIcon.svelte';
	import TrendingCarouselItems from '$components/TrendingFunds/TrendingCarouselItems.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import Button from '$components/Button.svelte';
	import { exitNudgeStore } from '$lib/stores/ExitNudgeStore';
	import Link from '$components/Link.svelte';
	import {
		exitNudgeBackClickEvent,
		exitNudgeImpressionEvent,
		exitNudgeKnowMoreClickEvent,
		exitNudgeStartSipClickEvent
	} from '$components/ExitNudge/analytics';

	export let nudgeData: StartFirstSipNudgeType;
	const { isin, schemeCode } = nudgeData?.data[userStore?.userType()?.toLowerCase()] || {};

	let schemeData: SchemeDetails | null = null;
	onMount(async () => {
		schemeData = await getSchemeData();
		exitNudgeStore.setShown();
		exitNudgeImpressionEvent();
	});

	async function getSchemeData(): Promise<SchemeDetails | null> {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		const res = await useFetch(url, { headers: { 'X-LRU': 'true' } }, fetch);

		if (res.ok) {
			return res.data;
			// return null;
		} else {
			close();
			return null;
		}
	}

	function close() {
		exitNudgeBackClickEvent();
		if (appStore.platform().toLowerCase() === PLATFORM_TYPE.SPARK_IOS) {
			window.location.href = `${window.location.origin}${base}/exit`;
		} else {
			window.open($appStore.closecta, '_self');
		}
	}

	function getSchemeDetailsPath() {
		return `/schemes/${normalizeFundName(
			schemeData?.schemeName,
			schemeData?.isin,
			schemeData?.schemeCode
		)}`;
	}

	function getOrderPadPath() {
		return `${getSchemeDetailsPath()}?orderpad=INVEST`;
	}

	function hideNudge() {
		exitNudgeStore.hideNudge();
	}
</script>

<Overlay containerClass="justify-end sm:!justify-center min-h-full">
	{#if schemeData}
		<article
			class="flex flex-col items-center justify-center rounded-t-lg bg-white px-4 py-6 sm:w-160 sm:rounded-lg sm:p-16"
		>
			<div class="mb-4 text-lg font-medium">Not sure where to get started?</div>
			<div class="mb-4 text-center text-sm font-medium">
				<div>Index funds are the right choice for new investors.</div>
				<div>Get started in two steps!</div>
			</div>

			<TrendingCarouselItems
				clazz="p-3 bg-white shadow-csm mb-4"
				schemes={schemeData}
				index={0}
				disableRedirection
			>
				<svelte:fragment slot="detailsLeft">
					<div class="flex flex-col items-start">
						<p class="text-xs font-medium text-black-bolder">Monthly Amount</p>
						<p class="text-base font-medium">
							₹{addCommasToAmountString(schemeData?.minSipAmount?.toString()) ||
								schemeData?.minSipAmount}
						</p>
					</div>
				</svelte:fragment>
				<svelte:fragment slot="topRightSection">
					<section class="ml-1 flex flex-col items-end">
						<div class="w-20 text-right text-xs font-medium text-black-bolder">Returns p.a</div>
						<article class="mt-0.5 flex items-center">
							<WMSIcon class="mr-1 mt-1 h-4 w-3" name="green-uparrow-trending-fund" />
							<div class="text-base font-bold text-black-title">
								{schemeData?.returns3yr?.toFixed(2)}%
							</div>
						</article>
					</section>
				</svelte:fragment>

				<svelte:fragment slot="detailsRight">
					<section class="flex flex-col items-end">
						<div class="text-xs font-medium text-black-bolder">Expected 3Y Returns</div>
						<div class="text-base font-bold text-green-amount">
							<AmountText amount={schemeData?.returns3yr} />
						</div>
					</section>
				</svelte:fragment>

				<svelte:fragment slot="detailsFooterDescription">
					<p class="text-xs">
						<span class="font-semibold">
							{addCommasToAmountString(schemeData?.totalInvesetment?.toString())}
						</span>
						people have invested in this fund
					</p>
				</svelte:fragment>
			</TrendingCarouselItems>

			<Link
				to={getSchemeDetailsPath()}
				on:linkClicked={() => {
					hideNudge();
					exitNudgeKnowMoreClickEvent();
				}}
			>
				<div class="mb-4 text-xs font-medium text-[#3F5BD9]">Know more about this fund</div>
			</Link>

			<Link
				class="w-full"
				to={getOrderPadPath()}
				on:linkClicked={() => {
					hideNudge();
					exitNudgeStartSipClickEvent();
				}}
			>
				<Button class="mb-2 w-full rounded capitalize">START YOUR FIRST SIP</Button>
			</Link>

			<Button class="capitalize" onClick={close} variant="transparent" size="md">GO BACK</Button>
		</article>
	{/if}
</Overlay>
