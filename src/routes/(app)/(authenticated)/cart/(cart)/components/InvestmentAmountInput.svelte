<script lang="ts">
	import { setErrorMessage } from '$lib/utils/helpers/investmentOrder';
	import { formatAmount } from '$lib/utils/helpers/formatAmount';
	import type { CartEntity } from '$lib/types/ICartStore';
	import { debounce } from '$lib/utils/helpers/debounce';
	export let cartItem: CartEntity;
	export let hasInputUpdated = false;

	let inputValue =
		cartItem.inputAmount || String(cartItem.inputAmount) === '0'
			? String(cartItem.inputAmount)
			: String(cartItem.amount);

	export let inputError = '';

	const setInputValue = (data: CartEntity) => {
		inputValue =
			data.inputAmount || String(data.inputAmount) === '0'
				? String(data.inputAmount)
				: String(data.amount);
		inputError = setErrorMessage(data, data.investmentType, inputValue);
		cartItem.inputError = inputError;
	};
	$: {
		setInputValue(cartItem);
	}
	const debouncedInputChangeDone = debounce(InputChangeDone);

	function onInputChange(e: { target: { value: string } }) {
		inputValue = e.target.value;
		inputValue = formatAmount(inputValue); // trim, remove alphabets and remove leading zeroes
		inputError = setErrorMessage(cartItem, cartItem.investmentType, inputValue);
		cartItem.inputError = inputError;
		cartItem.inputAmount = Number(inputValue);
		debouncedInputChangeDone();
	}
	function InputChangeDone() {
		if (!inputError && inputValue) {
			hasInputUpdated = true;
			cartItem.amount = Number(inputValue);
		}
	}
</script>

<div
	class="cart-input-box relative flex items-center max-sm:ml-2 sm:h-full {inputError
		? 'input-has-error'
		: ''}"
>
	<!-- on:input={onInputChange} -->
	<span class=" absolute left-1">₹</span>
	<input
		id={'switchAmountInput' + cartItem.cartItemId}
		inputmode="numeric"
		type="number"
		maxlength="13"
		placeholder=""
		value={inputValue}
		on:input={onInputChange}
		class="{inputError
			? '!outline-red-sell'
			: '!outline-blue-primary '}   cart-input !outline !h-7 w-full !rounded border-0 bg-white pl-3.5 text-base font-medium !leading-none text-black-title !outline-1 focus:outline-offset-0"
		size={100}
		disabled={false}
	/>
	<!-- on:blur={InputChangeDone} -->
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
</style>
