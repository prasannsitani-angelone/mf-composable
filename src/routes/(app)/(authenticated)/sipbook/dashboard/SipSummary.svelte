<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import {
		clickManageAutopayCtaAnalytics,
		clickSetupAutopayCtaAnalytics
	} from '$lib/analytics/sipbook/sipbook';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { deviceStore } from '$lib/stores/DeviceStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import type { ISipBookOverView } from '$lib/types/ISipType';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { PortfolioCard } from 'svelte-components';

	let bookSummary: ISipBookOverView;
	let automatedSipsCount = 0;
	export { bookSummary, automatedSipsCount };

	$: bankDetails = $profileStore?.bankDetails;

	const os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;
	const userAgent = $deviceStore.userAgent?.toLowerCase();

	const handleAutopayButtonClick = () => {
		if (automatedSipsCount) {
			clickManageAutopayCtaAnalytics({ AutopayEnabledSips: automatedSipsCount });

			const redirectPath = `${base}/autopay`;
			goto(redirectPath);
		} else {
			clickSetupAutopayCtaAnalytics({ AutopayEnabledSips: automatedSipsCount });

			const params = encodeObject({
				acc: bankDetails?.[0]?.accNO
			});
			goto(`${base}/autopay/manage/setup?params=${params}`);
		}
	};
</script>

<PortfolioCard
	class="mb-2 pb-3 pt-6 {$$props.class} {os?.toLowerCase() === 'ios' ||
	userAgent?.includes('safari')
		? 'overflow-hidden'
		: ''}"
>
	<article class="flex items-center justify-between border-b border-white/10 pb-5">
		<section class="flex-1 text-center">
			<div class="text-xs font-normal">Active SIPs</div>
			<div class="text-lg font-normal">
				{bookSummary?.totalSipOrder}
			</div>
		</section>

		<!-- Line Separator (mobile layout) -->
		<div class="block h-12 border-r border-white/10 md:hidden" />

		<section class="flex-1 text-center">
			<div class="text-xs font-normal">Monthly SIP Total</div>
			<div class="flex items-center justify-center text-lg font-normal">
				<div class="text-sm">₹</div>
				<div class="ml-0.5">
					{addCommasToAmountString(bookSummary?.totalSipInstallmentAmount?.toFixed(0))}
				</div>
			</div>
		</section>
	</article>

	<article class="light flex items-center justify-between px-4 pt-3">
		<div class="text-xs font-normal">
			Automated SIPs - <span class={automatedSipsCount ? 'text-background-alt' : 'text-sell'}
				>{automatedSipsCount}</span
			>
		</div>

		<button class="z-10 flex items-center" on:click={handleAutopayButtonClick}>
			<div class="text-sm font-medium">
				{automatedSipsCount ? 'MANAGE AUTOPAY' : 'SETUP AUTOPAY'}
			</div>
			<RightIcon stroke="white" />
		</button>
	</article>
</PortfolioCard>
