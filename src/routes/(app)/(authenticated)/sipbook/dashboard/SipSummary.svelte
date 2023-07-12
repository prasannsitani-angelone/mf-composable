<script lang="ts">
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import type { ISipBookOverView } from '$lib/types/ISipType';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	let bookSummary: ISipBookOverView;
	let automatedSipsCount = 0;
	export { bookSummary, automatedSipsCount };

	const handleAutopayButtonClick = () => {
		// based on automatedSipsCount, redirect to setup autopay journey or autopay list page
		if (automatedSipsCount) {
			//
		} else {
			//
		}
	};
</script>

<section
	class="relative mb-2 rounded-lg bg-gradient-to-r from-blue-gradient via-blue-gradient to-blue-primary pt-6 pb-3 text-white md:mt-0 lg:p-6"
>
	<div
		class={`absolute left-[34%] -top-56 h-[26rem] w-20 rotate-[-30deg] rounded-lg bg-gradient-to-b opacity-20 bg-blend-screen mix-blend-screen`}
	/>
	<article class="flex items-center justify-between border-b border-white/10 pb-5">
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

	<article class="flex items-center justify-between px-4 pt-3">
		<div class="text-xs font-medium">
			Automated SIPs - <span>{automatedSipsCount}</span>
		</div>

		<button class="flex items-center" on:click={handleAutopayButtonClick}>
			<div class="text-sm font-semibold">
				{automatedSipsCount ? 'MANAGE AUTOPAY' : 'SETUP AUTOPAY'}
			</div>
			<RightIcon stroke="white" />
		</button>
	</article>
</section>
