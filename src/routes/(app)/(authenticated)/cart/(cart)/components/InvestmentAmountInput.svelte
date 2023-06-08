<script lang="ts">
	import { Input } from 'wms-ui-component';
	import { setErrorMessage } from '$lib/utils/helpers/investmentOrder';
	import { formatAmount } from '$lib/utils/helpers/formatAmount';
	import type { CartEntity } from '$lib/types/ICartStore';
	export let cartItem: CartEntity;
	export let hasInputUpdated = false;

	let inputValue: string;

	export let inputError = '';

	function onInputChange(e: { target: { value: string } }) {
		inputValue = e.target.value;
		inputValue = formatAmount(inputValue); // trim, remove alphabets and remove leading zeroes
		inputError = setErrorMessage(cartItem, cartItem.investmentType, inputValue);
	}
	function InputChangeDone() {
		if (!inputError && inputValue) {
			hasInputUpdated = true;
			cartItem.amount = Number(inputValue);
		}
	}

	const classess = {
		input:
			'cart-input w-full bg-white text-sm font-medium leading-none text-black-title outline !rounded',
		container: 'cart-input-container'
	};
</script>

<div
	class="cart-input-box relative flex items-center sm:h-full {inputError ? 'input-has-error' : ''}"
>
	<!-- on:input={onInputChange} -->
	<Input
		id="switchAmountInput"
		inputmode="numeric"
		type="number"
		maxlength="13"
		placeholder=""
		value={cartItem?.amount}
		{onInputChange}
		on:blur={InputChangeDone}
		classes={classess}
		size={100}
		disabled={false}><span class="relative left-3" slot="preinput">₹</span></Input
	>
</div>

<style>
	.cart-input-box :global(input[type='number']::-webkit-inner-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}
	.cart-input-box :global(input[type='number']::-webkit-outer-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}
	.cart-input-box :global(.input) {
		outline: 1px solid #3f5bd9 !important;
		outline-offset: initial;
	}
	.input-has-error.cart-input-box :global(.input) {
		outline: 1px solid #f65e5a !important;
		outline-offset: initial;
	}
</style>
