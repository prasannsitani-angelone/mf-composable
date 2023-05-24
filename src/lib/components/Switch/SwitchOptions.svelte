<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button, WMSIcon } from 'wms-ui-component';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import type { FolioHoldingType } from '$lib/types/IInvestments';
	import { base } from '$app/paths';
	$: isMobile = $page.data.deviceType.isMobile;

	let schemeData: SchemeDetails;
	let switchFlags: string;
	let holdingDetails: FolioHoldingType;
	let redemptionNotAllowedText: string;
	const onSwitchNavigation = () => {
		if (isMobile) {
			const { schemeName, isin, schemeCode } = schemeData || {};
			if (isin) {
				goto(`${base}/schemes/switch/${normalizeFundName(schemeName, isin, schemeCode)}`);
			} else {
				const path = $page?.url?.pathname?.split('/');
				goto(`${base}/schemes/switch/${path[3]}`);
			}
		}
	};

	export { schemeData, switchFlags, holdingDetails, redemptionNotAllowedText };
</script>

<div
	class="animate-bottomTransition flex w-screen flex-col rounded-t-2xl rounded-b-none bg-white shadow-csm md:w-120 md:animate-none md:rounded-lg"
>
	<section class="flex-col items-center justify-between p-4 shadow-csm md:shadow-none">
		<Button
			variant="transparent"
			size="lg"
			disabled={switchFlags !== 'Y' ||
				!!redemptionNotAllowedText?.length ||
				!holdingDetails?.redemptionAllowed}
			class=" !flex !h-max w-full flex-nowrap !items-center !border-none !bg-white !p-0 !py-4 text-sm !font-normal !normal-case text-white active:opacity-95 disabled:opacity-30"
			on:click={onSwitchNavigation}
		>
			<div class="flex self-start px-2">
				<WMSIcon height={36} width={36} name="switch-fund" />
			</div>
			<div class="px-2 text-left text-grey-body">
				<p class="pb-1 text-sm font-medium text-black-title">Switch Funds</p>
				<p class="border-bottom !text-xs text-grey-body">
					Transfer your investment (partial or full) to another mutual fund from the same AMC
				</p>
			</div>
			<div class="flex items-center justify-center px-2 align-middle">
				<WMSIcon height={8} width={9} class="-rotate-90" name="arrow-expand" />
			</div>
		</Button>
	</section>
</div>
