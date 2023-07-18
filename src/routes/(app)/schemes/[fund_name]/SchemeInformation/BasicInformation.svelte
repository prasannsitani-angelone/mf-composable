<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import ExitLoadIcon from '$lib/images/icons/ExitLoadIcon.svelte';

	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	let schemeDetails: SchemeDetails;

	export { schemeDetails };
</script>

<section class="border-b">
	<!-- AUM -->
	<section class="flex flex-col gap-4 p-4 pt-0 lg:flex-row">
		<article
			class="flex-grow basis-0 rounded border-b border-grey-line bg-white px-3 py-4 lg:border lg:bg-grey"
		>
			<div
				class="mb-3 flex h-6 w-6 justify-center rounded-full bg-blue-primary align-middle leading-6 text-white"
			>
				₹
			</div>
			<h3 class="mb-1 text-xs font-medium text-grey-body">Asset Under Management</h3>
			<h4><AmountText amount={schemeDetails?.aum} /> <span>Cr.</span></h4>
		</article>
	</section>
	<!-- Expense Ratio  -->
	<section class="flex flex-col gap-4 p-4 pt-0 lg:flex-row">
		<article
			class="flex-grow basis-0 rounded border-b border-grey-line bg-white px-3 py-4 lg:border lg:bg-grey"
		>
			<div
				class="mb-3 flex h-6 w-6 justify-center rounded-full bg-blue-primary align-middle leading-6 text-white"
			>
				%
			</div>
			<h3 class="mb-1 text-xs font-medium text-grey-body">Expense Ratio</h3>
			<h4>
				<span>₹</span> <span>{schemeDetails?.expenseRatio}%</span>
				<span> (inclusive of GST)</span>
			</h4>
		</article>
	</section>
	<!-- Exit Load -->
	<section class="flex flex-col gap-4 p-4 pt-0 lg:flex-row">
		<article
			class="flex-grow basis-0 rounded border-b border-grey-line bg-white px-3 py-4 lg:border lg:bg-grey"
		>
			<ExitLoadIcon />
			<h3 class="mb-1 mt-3 text-xs font-medium text-grey-body">Exit Load</h3>
			<h4>{schemeDetails?.exitLoadValue}</h4>
		</article>
	</section>
</section>
