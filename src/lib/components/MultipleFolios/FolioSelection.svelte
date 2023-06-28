<script lang="ts">
	import Button from '$components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import type { FolioObject } from '$lib/types/IInvestments';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	export let folioList: Array<FolioObject>;
	export let selectedFolioNumber: string;
	export let switchInSchemeMode = '';

	const dispatch = createEventDispatcher();

	const isSwitchOrRedeemAllowed = (folio: FolioObject) => {
		if (
			folio?.redemableAmount <= 0 ||
			(profileStore?.accountType() === 'D' &&
				switchInSchemeMode === 'D' &&
				folio?.dpFlag === 'N') ||
			(profileStore?.accountType() === 'P' && switchInSchemeMode === 'P' && folio?.dpFlag === 'Y')
		) {
			return false;
		}
		return true;
	};

	const handleFolioSelection = (folio: FolioObject) => {
		if (isSwitchOrRedeemAllowed(folio)) {
			selectedFolioNumber = folio?.folioNumber;
		}
	};

	const handleConfirmClick = () => {
		dispatch('confirmSelectedFolio', selectedFolioNumber);
	};
</script>

<article class={$$props?.class}>
	<section class="max-h-full overflow-auto rounded pb-8 md:max-h-96 md:rounded-none">
		<slot name="header">
			<h4 class="p-2 text-lg font-medium text-black-title md:hidden md:p-0">
				Select Folio for Withdrawal
			</h4>
		</slot>

		{#each folioList as folio (folio?.folioNumber)}
			<section class="mt-3 mb-4 sm:mb-1">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<article
					class="cursor-default rounded-lg border bg-white font-medium shadow-csm md:cursor-pointer {!isSwitchOrRedeemAllowed(
						folio
					) && 'cursor-not-allowed opacity-50 shadow-none'}"
					on:click={() => handleFolioSelection(folio)}
				>
					<article
						class="flex items-center justify-between rounded-t-lg border-b bg-grey p-3 md:bg-grey"
					>
						<div class="text-sm font-medium text-black-title">
							<span class="mr-1">
								#{folio?.folioNumber}
							</span>
						</div>
						{#if isSwitchOrRedeemAllowed(folio)}
							<div>
								{#if selectedFolioNumber === folio?.folioNumber}
									<WMSIcon width={16} height={17} name="checkbox-checked-circle" />
								{:else}
									<WMSIcon width={16} height={17} name="checkbox-unchecked-circle" />
								{/if}
							</div>
						{/if}
					</article>

					<article class="mx-3 my-2.5">
						<section class="mb-4 flex items-center justify-between">
							<div class="text-sm text-grey-body">Value</div>
							<div class="text-sm text-black-title sm:text-base">
								₹{addCommasToAmountString(
									(folio?.redemableAmount + folio?.blockedAmount)?.toFixed(2)
								)}
							</div>
						</section>
						<section class="flex items-center justify-between">
							<div class="text-sm text-grey-body">Units</div>
							<div class="text-sm text-black-title sm:text-base">
								{folio?.redemableUnits + folio?.blockedunits}
							</div>
						</section>
					</article>
				</article>
			</section>
		{/each}
	</section>

	<!-- Footer Button -->
	<article class="mt-3 hidden md:block">
		<Button class="w-full rounded" onClick={handleConfirmClick}>CONFIRM FOLIO SELECTION</Button>
	</article>

	<!-- Confirm Folio Selection button for Mobile UI -->
	<article class="mx-3 mt-4 block md:hidden">
		<section class="fixed inset-0 top-auto bg-white px-4 py-3">
			<Button class="bottom-0 w-full rounded" onClick={handleConfirmClick}>
				CONFIRM FOLIO SELECTION
			</Button>
		</section>
	</article>
</article>
