<script lang="ts">
	import NumPad from '$components/Keyboard/NumPad.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	let amount = '';
	$: amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	let maximumAmountLimit = 999999999;
</script>

<article class="text-black-title">
	<input
		id="amountInput"
		inputmode="numeric"
		maxlength="13"
		placeholder="₹"
		value={amountVal}
		class="w-full bg-white text-base font-medium leading-none text-black-title outline-none"
		disabled
	/>

	<NumPad bind:number={amount} maxNumberLimit={maximumAmountLimit} />
</article>
