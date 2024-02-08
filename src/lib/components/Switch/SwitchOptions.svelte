<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { getFundUrlDetails, normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import type { FolioHoldingType } from '$lib/types/IInvestments';
	import { base } from '$app/paths';
	import { createEventDispatcher } from 'svelte';
	import SwitchSkeletonLoader from '../../../routes/(app)/(authenticated)/schemes/switch/[scheme_name]/SwitchSkeletonLoader.svelte';
	import SwitchHomePage from '../../../routes/(app)/(authenticated)/schemes/switch/[scheme_name]/SwitchHomePage/SwitchHomePage.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { decodeToObject } from '$lib/utils/helpers/params';
	$: isMobile = $page.data.deviceType.isMobile;

	const dispatch = createEventDispatcher();
	let schemeData: SchemeDetails;
	let switchFlags: string;
	let holdingDetails: FolioHoldingType;
	let redemptionNotAllowedText: string;
	let activePage = '';
	let isSwitch = false;

	const queryParams = $page.url.searchParams.get('params');
	const decodedParams = decodeToObject(queryParams || '');
	const { isin: switchInIsin, schemeCode: switchInSchemeCode } = decodedParams;

	const onSwitchNavigation = () => {
		if (isMobile) {
			const { schemeName, isin, schemeCode } = schemeData || {};
			if (isin) {
				goto(
					`${base}/schemes/switch/${normalizeFundName(
						schemeName,
						isin,
						schemeCode
					)}?params=${queryParams}`
				);
			} else {
				const path = $page?.url?.pathname?.split('/');
				goto(`${base}/schemes/switch/${path[3]}?params=${queryParams}`);
			}
		} else {
			activePage = 'SWITCH_FUNDS';
		}
	};

	$: {
		if (isSwitch) {
			onSwitchNavigation();
		}
	}

	const handleBackButtonNavigation = () => {
		dispatch('handleBackButtonNavigation');
	};

	const getFolioHoldings = async (): Promise<FolioHoldingType | null> => {
		const { isin } = getFundUrlDetails($page.url.href);
		let folioHolding: FolioHoldingType | null = null;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}`;
		const res = await useFetch(url, {});

		if (res.ok) {
			folioHolding = res?.data || [];
		}

		return folioHolding;
	};

	const getSwitchInSchemeData = async () => {
		if (switchInIsin) {
			const fundUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${switchInIsin}/${switchInSchemeCode}`;
			const res = await useFetch(fundUrl, {});
			return res;
		}
		return {};
	};

	export { schemeData, switchFlags, holdingDetails, redemptionNotAllowedText, isSwitch };
</script>

<div
	class={isMobile
		? 'flex w-screen flex-col rounded-b-none rounded-t-2xl bg-background-alt shadow-csm md:w-120 md:rounded-lg'
		: 'flex-col items-center border-b md:py-3'}
>
	{#if !isMobile && !activePage}
		<article class="mx-1 flex cursor-pointer items-center justify-start border-b px-3 py-2">
			<WMSIcon
				name="left-arrow"
				width={16}
				height={16}
				class="mr-3 cursor-pointer"
				on:click={handleBackButtonNavigation}
			/>
			<div class="text-md font-normal text-title">More Options</div>
		</article>
	{/if}
	{#if !activePage}
		<section class="flex-col items-center justify-between p-4 shadow-csm md:px-3 md:shadow-none">
			<ButtonMedium
				variant="transparent"
				size="lg"
				disabled={switchFlags !== 'Y' ||
					!!redemptionNotAllowedText?.length ||
					!holdingDetails?.redemptionAllowed}
				class=" !flex !h-max w-full flex-nowrap !items-center !border-none !bg-background-alt !p-0 !py-4 text-sm !font-normal !normal-case text-background-alt active:opacity-95 disabled:opacity-30"
				on:click={onSwitchNavigation}
			>
				<div class="flex self-start px-2 md:px-0 md:pr-2">
					<WMSIcon height={36} width={36} name="switch-fund" />
				</div>
				<div class="px-2 text-left text-body">
					<p class="pb-1 text-sm font-normal text-title">Switch Funds</p>
					<p class="border-bottom !text-xs text-body">
						Transfer your investment (partial or full) to another mutual fund from the same AMC
					</p>
				</div>
				<div class="flex items-center justify-center px-2 align-middle">
					<WMSIcon height={8} width={9} class="-rotate-90" name="arrow-expand" />
				</div>
			</ButtonMedium>
		</section>
	{:else if activePage === 'SWITCH_FUNDS' && !isMobile}
		{#await getFolioHoldings()}
			<SwitchSkeletonLoader />
		{:then folioHolding}
			{#await getSwitchInSchemeData()}
				<SwitchSkeletonLoader />
			{:then switchInSchemeData}
				{#if folioHolding}
					<SwitchHomePage
						{folioHolding}
						{switchInSchemeData}
						on:handleBackNavigation={() => (activePage = '')}
					/>
				{/if}
			{/await}
		{/await}
	{/if}
</div>
