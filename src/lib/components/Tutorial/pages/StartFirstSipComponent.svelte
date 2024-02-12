<script lang="ts">
	import Icon3 from '$components/Tutorial/icons/StartFirstBgIcon.svelte';
	import WMSIcon from '$components/WMSIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import GreenUpArrowTrendingFund from '$lib/images/GreenUpArrowTrendingFund.svg';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { goto } from '$app/navigation';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { base } from '$app/paths';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { browser } from '$app/environment';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { HEIGHT_OFFSET } from '$components/Tutorial/pages/const';

	let options = [
		'With Angel One, you can start your first SIP in just a few steps!',
		'Begin investing with just ₹100 each month',
		'Pay with your favourite UPI app, instantly'
	];

	let schemeDetails: SchemeDetails;

	let touchStartX = 0;
	let touchEndX = 0;
	let touchStartY = 0;
	let touchEndY = 0;

	const setStartTouchPoints = (e) => {
		touchStartX = e?.changedTouches[0]?.screenX;
		touchStartY = e?.changedTouches[0]?.screenY;
	};

	const setEndTouchPoints = (e) => {
		touchEndX = e?.changedTouches[0]?.screenX;
		touchEndY = e?.changedTouches[0]?.screenY;
		determineGesture();
	};

	const determineGesture = () => {
		let swipeThresholdValue = 100;
		if (touchStartY - touchEndY > 0 && touchStartY - touchEndY > swipeThresholdValue) {
			navigateToSchemeDetails();
		}
	};

	const navigateToSchemeDetails = async () => {
		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			schemeDetails?.schemeName,
			schemeDetails?.isin,
			schemeDetails?.schemeCode
		)}?orderpad=INVEST&params=${encodeObject({
			investmentType: 'SIP',
			paymentMandatory: true
		})}`;
		await goto(schemeDetailsPath);
	};

	const getSchemeDetails = async (): Promise<SchemeDetails> => {
		let schemeData: SchemeDetails;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/packs?packId=start_your_first_sip`;
		const res = await useFetch(url, { headers: { 'X-LRU': 'true' } }, fetch);

		if (res.ok) {
			let allSchemes = res.data.packs[0].schemes;
			let schemeWithMaxReturn = allSchemes.reduce(function (prev, current) {
				return prev && prev.returns3yr > current.returns3yr ? prev : current;
			});
			schemeData = schemeWithMaxReturn;
		} else {
			if (browser) {
				goto(`${base}/schemes/error`, { replaceState: true });
			} else {
				redirect(302, `${base}/schemes/error`);
			}
		}

		return schemeData;
	};

	onMount(async () => {
		schemeDetails = await getSchemeDetails();
	});
	let clientHeight = 0;
</script>

<div
	bind:clientHeight
	on:touchstart={setStartTouchPoints}
	on:touchend={setEndTouchPoints}
	class="flex h-screen flex-col bg-[#B99AE6] p-5 {$$props.class}"
>
	<section class="flex-1">
		<p class="mb-3 mt-10 text-2xl font-medium text-title">Starting Your First SIP</p>
		{#if clientHeight > HEIGHT_OFFSET}
			<Icon3 class="mx-auto mb-3" />
		{/if}

		<ul class="mb-4 ml-3">
			{#each options as option}
				<li class="mb-2 list-disc text-sm font-normal leading-6 text-title">
					{option}
				</li>
			{/each}
		</ul>

		<p class="mb-4 text-lg font-medium text-title">Top Pick for First Investment</p>

		<div class="flex flex-col">
			<div class="relative w-full overflow-hidden rounded-t-lg bg-background-alt">
				<div class=" flex flex-row p-3 opacity-[.99]">
					<div class="mr-2 flex flex-1 flex-row items-center">
						<SchemeLogo
							size="xs"
							src={schemeDetails?.logoUrl}
							alt={schemeDetails?.schemeName}
							lazy={'lazy'}
						/>
						<p class="text-sm font-normal text-title">
							{schemeDetails?.schemeName}
						</p>
					</div>
					<div class="flex flex-col items-end">
						<p class="text-xs font-normal">3 Year Returns</p>
						<div class="flex flex-row items-center">
							<img
								src={GreenUpArrowTrendingFund}
								class="mr-1 h-3 w-2.5"
								decoding="async"
								alt="Trending Funds Up Arrow"
								width="10"
								height="12"
							/>
							<p class="text-xs font-normal">
								<span class="text-base font-medium">{schemeDetails?.returns3yr.toFixed(2)}%</span> p.a
							</p>
						</div>
					</div>
				</div>
			</div>
			{#if schemeDetails?.noOfClientInvested}
				<div class="flex flex-row items-center rounded-b-lg bg-[#D1D8F6] p-2">
					<WMSIcon
						fill="var(--BODY)"
						name="people-icon"
						class="mr-2 p-1"
						decoding="async"
						alt="Number of people invested"
						width={24}
						height={24}
					/>

					<p class="text-xs text-body">
						<span class=" font-medium">
							{addCommasToAmountString(schemeDetails?.noOfClientInvested)}
						</span>
						people have invested in this fund
					</p>
				</div>
			{/if}
		</div>
	</section>

	<section class="flex flex-col items-center justify-center">
		<WMSIcon width={14} height={8} name="swipe-up" stroke="#000000" class="mb-1" />
		<p class="text-sm font-medium text-title">Swipe up to invest</p>
	</section>
</div>
