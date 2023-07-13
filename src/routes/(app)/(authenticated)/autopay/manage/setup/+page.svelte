<script lang="ts">
	import { page } from '$app/stores';

	import TopCard from './components/TopCard.svelte';
	import BottomCard from './components/BottomCard.svelte';
	export let data;

	let selectedAccount;

	$: profileData = $page?.data?.profile;

	const setupBankDetails = (profileDetail) => {
		const bankList = profileDetail?.bankDetails;

		const selectedAccNo = data.pageParam?.accountNumber;

		selectedAccount = bankList.filter((bank) => bank.accNO?.endsWith(selectedAccNo))[0];
	};

	const intiateAutoPayProcess = () => {
		// TODO: Autopay logic
	};

	$: setupBankDetails(profileData);
</script>

{#await data.api.data}
	Loading .....
{:then response}
	<TopCard nudgeData={response.nudges || []} />
	<BottomCard
		bankDetail={selectedAccount}
		accNOSubtring={data.pageParam?.accountNumber}
		{intiateAutoPayProcess}
	/>
{/await}
