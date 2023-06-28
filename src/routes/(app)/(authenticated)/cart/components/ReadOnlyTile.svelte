<script lang="ts">
	import Button from '$components/Button.svelte';
	import type { RemoveCartItem } from '$lib/types/ICartStore';
	import { getDateSuperscript } from '$lib/utils/helpers/date';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	export let schemeLogo = '';
	export let schemeName = '';
	export let isSip = false;
	export let amount: number;
	export let sipDate: number;
	export let cartItemId = 0;
	// eslint-disable-next-line
	export let onFundDelete: (items: RemoveCartItem) => void = (_: RemoveCartItem) => {};
	export let showDelete = false;
</script>

<section class="flex items-stretch bg-white">
	<div
		class="grid w-full grid-cols-[55%_45%] gap-y-2 border-b border-grey-line px-3 py-3 sm:grid-cols-[46%_18%_18%_18%] sm:items-center sm:px-6 sm:py-4"
	>
		<div class="col-start-1 row-start-1 flex flex-row items-center">
			<div
				class="mr-2 flex h-6 w-6 min-w-[24px] items-center rounded-full border border-grey-line bg-white shadow-csm sm:h-12 sm:w-12 sm:min-w-[48px]"
			>
				<img src={schemeLogo} alt="scheme logo" class="h-full w-full" />
			</div>
			<div class="text-sm font-medium text-black-title">{schemeName}</div>
		</div>
		<div
			class="col-start-1 row-start-2 ml-8 w-max rounded bg-grey p-1 text-xs font-medium text-black-title sm:col-start-2 sm:row-start-1 sm:ml-0 sm:rounded-none sm:bg-transparent sm:p-0"
		>
			{isSip ? 'SIP' : 'ONE TIME'}
		</div>
		{#if isSip}
			<div
				class="col-start-2 row-start-2 flex justify-end text-xs font-medium text-black-title sm:col-start-3 sm:row-start-1 sm:justify-start"
			>
				SIP Date : {sipDate?.toString().padStart(2, '0')}{getDateSuperscript(sipDate)}
			</div>
		{:else}
			<div class="col-start-2 row-start-2 sm:col-start-3 sm:row-start-1" />
		{/if}
		<div
			class="col-start-2 row-start-1 flex justify-end text-sm text-black sm:col-start-4 sm:justify-start"
		>
			<span>₹{addCommasToAmountString(amount?.toString())}</span>
		</div>
	</div>
	{#if showDelete}
		<div class="border-b sm:flex sm:items-center sm:pr-8">
			<Button
				class=""
				onClick={() => {
					onFundDelete({ schemeName, cartItemId });
				}}
				variant="transparent"><WMSIcon name="trash-icon" width={14} height={14} /></Button
			>
		</div>
	{/if}
</section>
