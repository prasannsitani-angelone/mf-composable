<script lang="ts">
	import Button from '$components/Button.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { setErrorMessage } from '$lib/utils/helpers/investmentOrder';
	import type { CartEntity } from '$lib/types/ICartStore';
	import clickOutside from '$lib/utils/useClickOutside';

	export let cartItem: CartEntity;

	export let hasInputUpdated = false;

	export let inputError = '';

	let activeSelection = {
		label: '',
		value: ''
	};
	let isDDOptionsVisible = false;
	interface Option {
		label: string;
		value: string;
	}
	const options: Option[] = [];
	function generateDDoptions(item: CartEntity) {
		if (item?.isSipAllowed === 'Y' && item?.sipMaxAmount > 0) {
			options.push({
				label: 'SIP',
				value: 'SIP'
			});
		}
		if (item?.isLumpsumAllowed === 'Y' && item?.lumpsumMaxAmount > 0) {
			options.push({
				label: 'ONE TIME',
				value: 'LUMPSUM'
			});
		}

		activeSelection = item.investmentType
			? options.filter((each) => each.value === item.investmentType)[0]
			: options[0];
	}
	function toggleDropdown() {
		// debugger;
		isDDOptionsVisible = !isDDOptionsVisible;
	}
	function setPreselectedAmount() {
		if (cartItem.investmentType === 'SIP') {
			cartItem.amount = cartItem.minSipAmount;
		} else if (cartItem.investmentType === 'LUMPSUM') {
			cartItem.amount = cartItem.minPurchaseAmount;
		}
		cartItem.inputAmount = cartItem.amount;
		inputError = setErrorMessage(cartItem, cartItem.investmentType, String(cartItem.amount));
		cartItem.inputError = inputError;
	}
	function dropdownItemSelected(selected: Option) {
		// Return if clicked on same item
		if (selected.value === activeSelection.value) {
			return;
		}
		hasInputUpdated = true;
		activeSelection = selected;
		closeDropDown();
		cartItem.investmentType = selected.value;
		setPreselectedAmount();
	}
	function closeDropDown() {
		isDDOptionsVisible = false;
	}
	generateDDoptions(cartItem);
</script>

<div class="relative flex items-center sm:h-full">
	<Button
		variant="transparent"
		class="relative flex w-20 items-center justify-between rounded-sm !bg-purple-background !p-1  max-sm:!h-auto"
		size="xs"
		onClick={toggleDropdown}
	>
		<span class="text-1xs font-medium leading-3 text-black-title"
			>{activeSelection?.label || '-'}</span
		><span><WMSIcon width={12} height={6} name="arrow-expand" /></span>
	</Button>
	{#if isDDOptionsVisible}
		<div
			class=" absolute top-6 left-0 z-10 flex w-28 flex-col rounded-sm border bg-white text-left shadow-csm sm:top-9"
			use:clickOutside
			on:outclick={closeDropDown}
		>
			{#each options as option}
				<Button
					variant="transparent"
					size="xs"
					class=" !w-full justify-start !rounded-none !border-b !border-inherit !text-xs font-medium !text-black-title {option.value ===
					activeSelection.value
						? '!bg-purple-background !font-normal !text-blue-primary'
						: ''}"
					onClick={(e) => {
						e.stopPropagation();
						dropdownItemSelected(option);
					}}>{option.label}</Button
				>
			{/each}
		</div>
	{/if}
</div>
