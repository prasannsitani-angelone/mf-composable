<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { deviceStore } from '$lib/stores/DeviceStore';
	import type { ISipBookOverView } from '$lib/types/ISipType';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	let bookSummary: ISipBookOverView;
	let automatedSipsCount = 0;
	export { bookSummary, automatedSipsCount };

	const os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;
	const userAgent = $deviceStore.userAgent?.toLowerCase();

	const handleAutopayButtonClick = () => {
		// based on automatedSipsCount, redirect to setup autopay journey or autopay list page
		if (automatedSipsCount) {
			const redirectPath = `${base}/autopay`;

			goto(redirectPath);
		} else {
			//
		}
	};
</script>

<section
	class="relative mb-2 rounded-lg bg-gradient-to-r from-blue-gradient via-blue-gradient to-blue-primary pt-6 pb-3 text-white md:mt-0 lg:p-6 {os ===
		'iOS' || userAgent?.includes('safari')
		? 'overflow-hidden'
		: ''}"
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
			<div class="flex items-center justify-center text-lg font-medium">
				<div class="text-sm">₹</div>
				<div class="ml-0.5">
					{addCommasToAmountString(bookSummary?.totalSipInstallmentAmount?.toFixed(0))}
				</div>
			</div>
		</section>
	</article>

	<article class="flex items-center justify-between px-4 pt-3">
		<div class="text-xs font-medium">
			Automated SIPs - <span class={automatedSipsCount ? 'text-white' : 'text-red-errorDark'}
				>{automatedSipsCount}</span
			>
		</div>

		<button class="flex items-center z-10" on:click={handleAutopayButtonClick}>
			<div class="text-sm font-semibold">
				{automatedSipsCount ? 'MANAGE AUTOPAY' : 'SETUP AUTOPAY'}
			</div>
			<RightIcon stroke="white" />
		</button>
	</article>
</section>
