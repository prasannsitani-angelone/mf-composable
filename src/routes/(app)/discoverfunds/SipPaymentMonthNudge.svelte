<script lang="ts">
	import { base } from '$app/paths';
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { goto } from '$app/navigation';
	import type { IRetryPaymentNudge } from '$lib/types/INudge';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { format } from 'date-fns';

	export let sipCount = 0;
	export let sip: IRetryPaymentNudge;

	const navigateToInvestmentPad = () => {
		const reRouteUrl = 'schemes';
		let routerPath = `${reRouteUrl}/${normalizeFundName(
			sip?.schemeName,
			sip?.isin,
			sip?.schemeCode
		)}`;
		const params = encodeObject({
			orderId: sip?.orderID,
			pgTxnId: sip?.pgTxnId,
			investmentType: 'LUMPSUM',
			investmentAmount: sip?.amount,
			sipInstalmentId: (sip?.orderID || '')?.toString(),
			isAdditionalFlag: true
		});
		goto(`${base}/${routerPath}?params=${params}&orderpad=INVEST`);
	};

	const navigateToSipDashboard = () => {
		goto(`${base}/sipbook/dashboard`);
	};
</script>

<section class="mt-2 rounded-lg shadow-csm">
	<article
		class="via-yellow flex items-center justify-between gap-3 rounded-tl rounded-tr-lg border-l-4 border-yellow-primary bg-gradient-to-r from-white to-yellow-50 px-3 py-2 text-xs font-normal text-black-title"
	>
		<div class="flex items-center justify-start">
			<WMSIcon name="alert-icon" />
			<p class={sipCount > 1 ? 'ml-2' : 'ml-3'}>SIP Payment Due</p>
		</div>

		<div class="text-[9px]">
			Pay by {format(new Date(Number(sip?.orderDate || 0) * 1000), 'dd MMM yyyy')}
		</div>
	</article>

	<div class="rounded-b-lg bg-white px-2 pb-3 pt-4">
		<div>
			<ResultItem
				class="justify-between px-0 py-3 pt-0 {sipCount <= 1 && 'pb-0'}"
				data={{
					logoUrl: `${sip.logoUrl}`,
					categoryName: '',
					schemeName: `${sip.schemeName}`
				}}
				itemStyle="border-none items-center"
				titleStyle={sipCount > 1 ? '!ml-6' : ''}
			>
				<svelte:fragment slot="schemeLogo">
					{#if sipCount > 1}
						<div class="w-18 relative">
							<SchemeLogo src={sip.logoUrl} alt="logo" size="xs" />
							<span
								class="absolute left-6 top-0 z-10 mr-3 h-9 w-9 rounded-full border bg-white object-cover py-2.5 text-center text-xs font-normal shadow-csm"
								>+ {sipCount - 1}</span
							>
						</div>
					{:else}
						<SchemeLogo src={sip.logoUrl} alt="logo" size="xs" />
					{/if}
				</svelte:fragment>

				<svelte:fragment slot="ratingSection">
					{#if sipCount === 1}
						<span class="rounded-sm bg-grey p-1 text-3xs font-normal">{sip.investmentType}</span>
					{:else}
						<span />
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="returns">
					<section class="flex flex-col items-end font-normal">
						<span class="text-sm font-normal"
							>₹{addCommasToAmountString(sip?.amount?.toString())}</span
						>
					</section>
				</svelte:fragment>
			</ResultItem>
		</div>
		<div class="border-t border-grey-line pt-1 text-right">
			{#if sipCount === 1}
				<ButtonMedium
					size="xs"
					class="h-0 min-h-0 pr-0 text-xs"
					variant="transparent"
					on:click={navigateToInvestmentPad}
				>
					PAY NOW
				</ButtonMedium>
			{:else}
				<ButtonMedium
					class="h-0 min-h-0 pr-0 text-xs"
					size="xs"
					variant="transparent"
					on:click={navigateToSipDashboard}
				>
					VIEW PENDING SIP<span class="lowercase">s</span>
				</ButtonMedium>
			{/if}
		</div>
	</div>
</section>
