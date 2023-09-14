<script lang="ts">
	import Card from '$components/Card.svelte';
	import RiskMessage from './components/RiskMessage.svelte';
	import InfoList from './components/InfoList.svelte';
	import BankDetails from './components/BankDetails.svelte';
	import { getSipAmountWithoutMandate } from '../utils';
	import ManageSkeletanLoader from './components/ManageSkeletanLoader.svelte';
	import { page } from '$app/stores';
	import { decodeToObject } from '$lib/utils/helpers/params';
	import UPIMandateIcon from '$lib/images/icons/UPIMandateIcon.svelte';

	export let data;
	const params = $page.url.searchParams.get('params');
	const { showAlert = false } = decodeToObject(params || '');
</script>

{#await data.api.data}
	<ManageSkeletanLoader />
{:then response}
	{@const { totalAmount } = getSipAmountWithoutMandate(response?.data)}
	<Card class="px-2 pb-6 pt-4">
		{#if showAlert}
			<RiskMessage {totalAmount} />
		{/if}
		<div class="my-16 flex justify-center">
			<UPIMandateIcon class=" h-[200px] w-[265px]" />
		</div>
		<section class=" m-auto text-center text-2xl font-medium text-black-title">
			<div>Automate your SIP</div>
			<div>Payments with Autopay</div>
		</section>
		<InfoList />
		<BankDetails {totalAmount} />
	</Card>
{/await}
