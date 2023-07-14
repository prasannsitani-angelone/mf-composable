<script lang="ts">
	import { page } from '$app/stores';
    import { tick } from 'svelte';
	import TopCard from './components/TopCard.svelte';
	import BottomCard from './components/BottomCard.svelte';
    import Mandate from '$components/mandate/Mandate.svelte';
    import { getSipAmountWithoutMandate } from '../utils';
    import MandateSuccessPopup from './components/MandateSuccessPopup.svelte';

	export let data;
    let selectedAccount = 0;
	let selectedAccountDetail;
    let mandateInstance: Mandate | null = null;

	$: profileData = $page?.data?.profile;

	const setupBankDetails = (profileDetail) => {
		const bankList = profileDetail?.bankDetails;

		const selectedAccNo = data.pageParam?.accountNumber;

		selectedAccountDetail = bankList.filter((bank, index) => {
            if(bank.accNO?.endsWith(selectedAccNo)){
                selectedAccount = index;
                return true;
            }
        })[0];
	};

	const intiateAutoPayProcess = async() => {
		await tick();
		mandateInstance?.startProcess(true);
	};

	$: setupBankDetails(profileData);
</script>

{#await data.api.data}
	Loading .....
{:then response}
	<TopCard nudgeData={response.nudges || []} />
	<BottomCard
		bankDetail={selectedAccountDetail}
		accNOSubtring={data.pageParam?.accountNumber}
		{intiateAutoPayProcess}
	/>
    <Mandate
            {selectedAccount}
			bind:this={mandateInstance}
			amount={String(getSipAmountWithoutMandate(response.nudges))}
			successButtonTitle="DONE"
		>
        <svelte:fragment slot='mandate-success'>
            <MandateSuccessPopup />
        </svelte:fragment>
        </Mandate>
{/await}
