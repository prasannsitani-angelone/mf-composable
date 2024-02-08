<script>
	import ClosedFolderIcon from '$lib/images/icons/ClosedFolderIcon.svelte';
</script>

<div class="mt-2 flex flex-col bg-background-alt px-2 py-4">
	<div class="flex items-center">
		<h5 class="text-title">SGB Series 3 - 2022</h5>
		<ClosedFolderIcon class="ml-2" />
		<span class="text-xs text-primary">24</span>
	</div>
	<div class="mt-3 grid grid-cols-2 divide-x divide-border rounded border px-3 py-2">
		<div>
			<span class="text-xs text-body">Current Value</span>
			<h4 class="text-title">₹10,000</h4>
		</div>
		<div class="text-right">
			<span class="text-xs text-body">Investment Amt</span>
			<h4 class="text-title">₹5,000</h4>
		</div>
	</div>
	<div class="mt-3 flex py-2">
		<div class="flex flex-1 items-center justify-center bg-background">
			<span class="text-xs text-body">Gain</span>
			<h5 class="ml-2 text-title">₹5,000</h5>
		</div>
		<div class="ml-2 flex flex-1 items-center justify-center bg-background">
			<span class="text-xs text-body">XIRR</span>
			<h5 class="ml-2 text-buy">+33.00%</h5>
		</div>
	</div>
</div>
