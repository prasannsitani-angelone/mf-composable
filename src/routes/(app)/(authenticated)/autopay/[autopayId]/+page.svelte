<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import CardStatusPending from '$components/CardStatus/CardStatusPending.svelte';
	import BankAutopayCard from '$components/mandate/components/BankAutopayCard.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getBankLogoUrl } from '$lib/utils';
	import AutopayDetails from './components/AutopayDetails.svelte';
	import LinkedSipCard from './components/LinkedSipCard.svelte';
	import AutopayDetailsLoader from './components/AutopayDetailsLoader.svelte';
	import AutopaySipsLinkedLoader from './components/AutopaySipsLinkedLoader.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { AutopayDetailsType } from '$lib/types/IEmandate';
	import {
		autopayDetailsImpressionAnalytics,
		autopayDetailsSipLinkedClickAnalytics
	} from '$lib/analytics/sipbook/sipbook';
	import type { ISip } from '$lib/types/ISipType';
	import PageTitle from '$components/PageTitle.svelte';

	$: bankDetails = $profileStore?.bankDetails;

	const redirectToSipDetails = (sip: ISip) => {
		autopayDetailsSipLinkedClickAnalytics({
			SipName: sip?.schemeName,
			SipAmount: sip?.installmentAmount
		});

		const redirectPath = `${base}/sipbook/${sip?.sipId}`;
		goto(redirectPath);
	};

	export let data;

	const autopayDetailsImpressionAnalyticsFunc = (mandate: AutopayDetailsType) => {
		const sipsLinkedArray = [];

		data?.api?.sipsLinked?.then((res: unknown) => {
			(res?.data?.sips || [])?.forEach((sip: ISip) => {
				sipsLinkedArray.push({
					SipName: sip?.schemeName,
					SipAmount: sip?.installmentAmount
				});
			});
		});

		const eventMetadata = {
			BankName: mandate?.bankName,
			status:
				mandate?.mandateStatus?.toLowerCase() !== 'success'
					? 'failed'
					: !mandate?.inProgress
					? 'success'
					: 'in progress',
			AutopayType: mandate?.authenticationMode?.toUpperCase(),
			AutopayId: mandate?.mandateId,
			AutopayLimit: mandate?.amount,
			SipsLinked: sipsLinkedArray
		};

		autopayDetailsImpressionAnalytics(eventMetadata);
	};

	onMount(() => {
		data?.api?.mandateData?.then((res: unknown) => {
			autopayDetailsImpressionAnalyticsFunc(res?.data);
		});
	});
</script>

<article class="mb-2" data-testid="autopayDetails">
	<header class="hidden sm:block">
		<PageTitle title="Autopay Details" class="mb-4 flex" />
	</header>
	{#await data.api.mandateData}
		<AutopayDetailsLoader />
	{:then response}
		<section>
			{#if response?.status === 'success' && response?.data}
				{#if response?.data?.inProgress}
					<CardStatusPending
						class="-mx-2 -mt-2 mb-2"
						heading="In Progress"
						subHeading="Your autopay will be activated within 3 days"
					/>
				{/if}
				<BankAutopayCard
					bankAccountNumber={response?.data?.accountNo}
					bankName={response?.data?.bankName}
					bankLogo={getBankLogoUrl(bankDetails, response?.data?.accountNo)}
					class={`px-3 pl-3 pt-6`}
					cardBodyClass="pb-4 border-b"
					bankDetailsClass="ml-2"
					bankAccNoClass="mt-1.5"
					bankLogoClass="-mt-1 !px-2 !py-1 h-9 w-9 flex items-center justify-center rounded-full border border-grey bg-white"
				>
					<svelte:fragment slot="header">
						{#if !response?.data?.inProgress}
							<div class="-mt-4 mb-2 text-[10px] font-normal uppercase text-grey-body">
								{response?.data?.authenticationMode}
							</div>
						{:else}
							<span />
						{/if}
					</svelte:fragment>

					<svelte:fragment slot="autopayStatusSlot">
						<span />
					</svelte:fragment>

					<svelte:fragment slot="footer">
						<AutopayDetails autopay={response?.data} />
					</svelte:fragment>
				</BankAutopayCard>
			{/if}
		</section>
	{/await}

	{#await data.api.sipsLinked}
		<AutopaySipsLinkedLoader />
	{:then response}
		<section>
			{#if response?.status === 'success' && response?.data?.sips?.length}
				<article class="mt-2 rounded-lg bg-white p-3 text-black-title shadow-csm">
					<div class="text-sm font-normal">SIPs Linked</div>
					<section class="mt-4">
						{#each response?.data?.sips as sip, index (sip?.sipId)}
							<div
								on:click={() => redirectToSipDetails(sip)}
								on:keypress={() => {
									//
								}}
								role="button"
								tabindex="0"
							>
								<LinkedSipCard
									name={sip?.schemeName}
									logoUrl={sip?.logoUrl}
									class={`${index > 0 ? 'border-t border-grey pt-4' : ''} ${
										index < response?.data?.sips?.length - 1 ? 'mb-3' : ''
									}`}
								>
									<svelte:fragment slot="subtextSlot">
										<div class="mt-1 text-xs font-normal text-grey-body">
											SIP Amount
											<span class="text-black-key">
												<AmountText amount={sip?.installmentAmount} />
											</span>
										</div>
									</svelte:fragment>
								</LinkedSipCard>
							</div>
						{/each}
					</section>
				</article>
			{/if}
		</section>
	{/await}
</article>
