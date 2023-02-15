<script lang="ts">
	let investmentAmt: string;
	let issuePrice: string;
	let appliedDate: string;
	let showQuantity = false;
	let quantity = 0;
	let clazz = '';
	export { investmentAmt, issuePrice, appliedDate, clazz as class };
</script>

<div class={`mt-3 flex items-center justify-between ${clazz}`}>
	<div>
		<span class="text-xs text-grey-body">Investment Amt</span>
		<h4 class="text-black-title">{`₹${investmentAmt}`}</h4>
	</div>
	{#if showQuantity}
		<div class="text-center">
			<span class="text-xs text-grey-body">Quantity</span>
			<h4 class="text-black-title">{quantity}</h4>
		</div>
	{:else}
		<div class="text-center">
			<span class="text-xs text-grey-body">Issue Price</span>
			<h4 class="text-black-title">{`₹${issuePrice}/g`}</h4>
		</div>
	{/if}
	<div class="text-right">
		<span class="text-xs text-grey-body">Applied On</span>
		<h4 class="text-black-title">{appliedDate}</h4>
	</div>
</div>
