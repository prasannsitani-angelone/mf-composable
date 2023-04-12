<script lang="ts">
	import type { ISipBookOverView } from '$lib/types/ISipType';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	let bookSummary: ISipBookOverView;
	export { bookSummary };
</script>

<section
	class="mb-2 mt-2 rounded-lg bg-gradient-to-r from-blue-900 via-blue-800 to-blue-primary pt-6 pb-4 text-white md:mt-0 lg:p-6"
>
	<article class="flex items-center justify-between">
		<section class="flex-1 text-center">
			<div class="text-xs font-normal">Active SIPs</div>
			<div class="text-lg font-medium">
				{bookSummary?.totalSipOrder}
			</div>
		</section>

		<!-- Line Separator (mobile layout) -->
		<div class="block h-12 border-r border-white/10 md:hidden" />

		<section class="flex-1 text-center">
			<div class="text-xs font-normal">Monthly SIP Total</div>
			<div class="text-lg font-medium">
				₹{addCommasToAmountString(bookSummary?.totalSipInstallmentAmount?.toFixed(0))}
			</div>
		</section>
	</article>
</section>
