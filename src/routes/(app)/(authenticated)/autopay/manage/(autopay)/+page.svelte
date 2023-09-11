<script lang="ts">
	import Button from '$components/Button.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import Card from '$components/Card.svelte';
	import RiskMessage from './components/RiskMessage.svelte';
	import AutopayIllustration from './components/AutopayIllustration.svelte';
	import InfoList from './components/InfoList.svelte';
	import BankDetails from './components/BankDetails.svelte';
	import { getSipAmountWithoutMandate } from '../utils';
	import ManageSkeletanLoader from './components/ManageSkeletanLoader.svelte';
	import { page } from '$app/stores';
	import { decodeToObject } from '$lib/utils/helpers/params';

	export let data;
	const params = $page.url.searchParams.get('params');
	const { showAlert = false } = decodeToObject(params || '');

	const navigateToAutopayDashboard = () => {
		goto(`${base}/autopay`);
	};
</script>

{#await data.api.data}
	<ManageSkeletanLoader />
{:then response}
	{@const { totalAmount } = getSipAmountWithoutMandate(response?.data)}
	{#if totalAmount > 0}
		<Card class="px-2 pb-6 pt-4">
			{#if showAlert}
				<RiskMessage {totalAmount} />
			{/if}
			<AutopayIllustration class="mt-5 flex justify-center" />
			<section class=" m-auto text-center text-2xl font-medium text-black-title">
				<div>Automate your SIP</div>
				<div>Payments with Autopay</div>
			</section>
			<InfoList />
			<BankDetails {totalAmount} />
		</Card>
	{:else}
		<Card
			><div class="flex flex-col items-center justify-center text-lg font-medium">
				<div class=" text-center">
					You already have existing autopay setup from your account.<br /><br /> You can still manage
					your autopay.
				</div>
				<Button class="mt-8" variant="outlined" onClick={navigateToAutopayDashboard}
					>Manage Autopay</Button
				>
			</div></Card
		>
	{/if}
{/await}
