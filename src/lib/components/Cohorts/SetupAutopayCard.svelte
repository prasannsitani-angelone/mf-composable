<script lang="ts">
	import Button from '$components/Button.svelte';
	import { BtnVariant, WMSIcon, addCommasToAmountString } from 'svelte-components';
	import PaymentAppsIcon from '$lib/images/PaymentAppsIcon.svelte';
	import { modifiedGoto } from '$lib/utils/goto';
	import { base } from '$app/paths';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { encodeObject } from '$lib/utils/helpers/params';

	let sipPendingCount = 0;
	let sipTotalAmount = 0;

	$: bankDetails = $profileStore?.bankDetails;

	const redirectToSetupAutopay = () => {
		const params = encodeObject({
			acc: bankDetails?.[0]?.accNO
		});

		modifiedGoto(`${base}/autopay/manage/setup?params=${params}`);
	};

	export { sipPendingCount, sipTotalAmount };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if sipPendingCount}
	<article
		class="max-w-4xl rounded-lg bg-background-alt p-3 shadow-csm md:cursor-pointer {$$props.class}"
		on:click={redirectToSetupAutopay}
	>
		<section class="flex items-center">
			<WMSIcon name="exclamation-circle-solid" width={28} height={28} stroke="var(--SELL)" />
			<div class="ml-1 text-base font-medium text-title">
				{sipPendingCount} SIP{sipPendingCount > 1 ? 's' : ''} worth ₹{addCommasToAmountString(
					sipTotalAmount?.toFixed(0)
				)} at risk
			</div>
		</section>

		<section class="mt-3">
			<div class="text-xs font-normal text-body">
				You are at risk of missing SIP payments! Set up autopay today and protect your portfolio
				from volatility
			</div>
		</section>

		<section class="mt-3 flex items-center justify-between">
			<PaymentAppsIcon />

			<Button variant={BtnVariant?.Contained} class="rounded">SET UP AUTOPAY</Button>
		</section>
	</article>
{/if}
