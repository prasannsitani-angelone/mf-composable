<script lang="ts">
	import Card from '$components/Card.svelte';
	import RiskMessage from './components/RiskMessage.svelte';
	import InfoList from './components/InfoList.svelte';
	import BankDetails from './components/BankDetails.svelte';
	import { getSipAmountWithoutMandate } from '../utils';
	import ManageSkeletanLoader from './components/ManageSkeletanLoader.svelte';
	import { page } from '$app/stores';
	import UPIMandateIcon from '$lib/images/icons/UPIMandateIcon.svelte';

	export let data;
	const { showAlert = false } = $page.data.urlSource;
</script>

{#await data.api.data}
	<ManageSkeletanLoader />
{:then response}
	{@const { totalAmount } = getSipAmountWithoutMandate(response?.data)}
	<Card class="mb-36 px-2 pb-4 pt-4">
		{#if showAlert}
			<RiskMessage {totalAmount} />
		{/if}
		<div class="my-16 flex justify-center">
			<UPIMandateIcon class=" h-[200px] w-[265px]" />
		</div>
		<section class=" m-auto text-center text-2xl font-normal text-title">
			<div>Automate your SIP</div>
			<div>Payments with Autopay</div>
		</section>
		<InfoList />

		<article class="mt-4 hidden md:block">
			<BankDetails {totalAmount} />
		</article>
	</Card>

	<article class="fixed inset-0 top-auto z-20 block bg-background-alt p-2 md:hidden">
		<BankDetails {totalAmount} />
	</article>
{/await}
