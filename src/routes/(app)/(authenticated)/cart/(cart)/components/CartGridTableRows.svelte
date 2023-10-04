<script lang="ts">
	import { onMount } from 'svelte/internal';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { Checkbox } from 'svelte-components';
	import InvestmentTypeDropdown from './InvestmentTypeDropdown.svelte';
	import InvestmentAmountInput from './InvestmentAmountInput.svelte';
	import SipDatePicker from './SipDatePicker.svelte';
	import { createPatchPayload } from '../utils';
	import { getInvestmentType } from '$lib/utils/helpers/investmentOrder';
	import { updateCartItem } from '$lib/services/cart';
	import type { CartEntity } from '$lib/types/ICartStore';

	export let cartItem: CartEntity;

	let hasMounted = false;

	let hasInputUpdated = false;
	let inputError = '';
	let showSIPDateSelect = getInvestmentType(cartItem) === 'SIP';

	function triggerPatchCallForThisChange(data: boolean) {
		if (!hasMounted || !data) {
			return;
		}

		cartItem = cartItem;
		updateLocalState();
		let dPayload = createPatchPayload(cartItem);
		updateCartItem(cartItem?.cartItemId, dPayload);
		hasInputUpdated = false;
	}

	function updateLocalState() {
		showSIPDateSelect = getInvestmentType(cartItem) === 'SIP';
	}

	function handleCheckboxChange() {
		cartItem.isSelected = !cartItem.isSelected;
		if (cartItem.isSelected && inputError) {
			inputError = '';
			cartItem.inputError = '';
			cartItem.inputAmount = cartItem.amount;
		}
		hasInputUpdated = true;
	}

	$: triggerPatchCallForThisChange(hasInputUpdated);
	updateLocalState();
	onMount(() => {
		hasMounted = true;
	});
</script>

<div
	class="grid grid-cols-[10%_1fr_28%] border-b px-3 py-3 sm:grid-cols-[4%_45%_20%_20%_11%] sm:px-6 sm:py-4"
>
	<div class="col-span-1 col-start-1 row-span-1 row-start-1">
		<Checkbox
			class="max-sm:mt-2 sm:h-full"
			checked={cartItem.isSelected}
			on:click={handleCheckboxChange}
		/>
	</div>
	<div class="col-span-1 col-start-2 row-span-1 row-start-1">
		<div class="flex sm:items-center">
			<SchemeLogo
				src={cartItem?.logoUrl}
				alt={cartItem?.schemeName}
				class="max-sm:h-9 max-sm:w-9"
				imageClass="max-sm:!h-9"
			/>
			<h3 class={`whitespace-normal text-sm font-normal text-black-title`}>
				{cartItem?.schemeName}
			</h3>
		</div>
	</div>
	<div
		class="col-span-1 col-start-2 row-span-1 row-start-2 max-sm:ml-12 max-sm:mt-1 sm:col-start-3 sm:row-start-1"
	>
		<InvestmentTypeDropdown bind:cartItem bind:hasInputUpdated bind:inputError />
	</div>
	<div
		class="col-span-1 col-start-3 row-span-1 row-start-2 max-sm:mt-1 sm:col-start-4 sm:row-start-1"
	>
		{#if showSIPDateSelect}
			<SipDatePicker bind:cartItem bind:hasInputUpdated />
		{/if}
	</div>
	<div class="col-span-1 col-start-3 row-span-1 row-start-1 sm:col-start-5">
		<InvestmentAmountInput bind:cartItem bind:inputError bind:hasInputUpdated />
	</div>
	{#if inputError}
		<span
			class="col-span-3 col-start-1 row-span-1 row-start-3 mt-1 text-right text-xs font-normal text-red-sell sm:col-span-5 sm:row-start-2"
			>{inputError}</span
		>
	{/if}
</div>
