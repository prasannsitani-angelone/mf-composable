<script lang="ts">
	import CardStatusPending from '$components/CardStatus/CardStatusPending.svelte';
	import BankAutopayCard from '$components/mandate/components/BankAutopayCard.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getBankLogoUrl } from '$lib/utils';
	import AutopayDetails from './components/AutopayDetails.svelte';
	import LinkedSipCard from './components/LinkedSipCard.svelte';
	import AutopayDetailsLoader from './components/AutopayDetailsLoader.svelte';
	import AutopaySipsLinkedLoader from './components/AutopaySipsLinkedLoader.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	$: bankDetails = $profileStore?.bankDetails;

	const redirectToSipDetails = (sipId: string) => {
		const redirectPath = `${base}/sipbook/${sipId}`;
		goto(redirectPath);
	};

	export let data;
</script>

<article class="mb-2" data-testid="autopayDetails">
	{#await data.api.mandateData}
		<AutopayDetailsLoader />
	{:then response}
		<section>
			{#if response?.status === 'success' && response?.data}
				{#if !response?.data?.umrnNo || !response?.data?.umrnNo?.length}
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
						{#if response?.data?.umrnNo?.length}
							<div class="-mt-4 mb-2 text-[10px] font-medium uppercase text-grey-body">
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
			{#if response?.status === 'success' && response?.data}
				<article class="mt-2 rounded-lg bg-white p-3 text-black-title shadow-csm">
					<div class="text-sm font-medium">SIPs Linked</div>
					<section class="mt-4">
						{#each response?.data?.sips as sip, index (sip?.sipId)}
							<div
								on:click={() => redirectToSipDetails(sip?.sipId)}
								on:keypress={() => {
									//
								}}
								role="button"
								tabindex="0"
							>
								<LinkedSipCard
									name={sip?.schemeName}
									subtext={`SIP Amount ₹${addCommasToAmountString(sip?.installmentAmount)}`}
									logoUrl={sip?.logoUrl}
									class={`${index > 0 ? 'border-t border-grey pt-4' : ''} ${
										index < response?.data?.sips?.length - 1 ? 'mb-3' : ''
									}`}
								/>
							</div>
						{/each}
					</section>
				</article>
			{/if}
		</section>
	{/await}
</article>
