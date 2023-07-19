<script lang="ts">
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import TopCard from './components/TopCard.svelte';
	import BottomCard from './components/BottomCard.svelte';
	import Mandate from '$components/mandate/Mandate.svelte';
	import { getSipAmountWithoutMandate } from '../utils';
	import MandateSuccessPopup from './components/MandateSuccessPopup.svelte';
	import type { BankDetailsEntity, UserProfile } from '$lib/types/IUserProfile';
	import SetupSkeletanLoader from './components/SetupSkeletanLoader.svelte';

	export let data;
	let selectedAccount = 0;
	let selectedAccountDetail: BankDetailsEntity;
	let mandateInstance: Mandate | null = null;

	$: profileData = $page?.data?.profile;

	const setupBankDetails = (profileDetail: UserProfile) => {
		const bankList = profileDetail?.bankDetails;

		const selectedAccNo = data.pageParam?.accountNumber;

		selectedAccountDetail = (bankList || []).filter((bank, index: number) => {
			if (bank.accNO?.endsWith(selectedAccNo)) {
				selectedAccount = index;
				return true;
			}
		})[0];
	};

	const intiateAutoPayProcess = async () => {
		await tick();
		mandateInstance?.startProcess(true);
	};

	$: setupBankDetails(profileData);
</script>

{#await data.api.data}
	<SetupSkeletanLoader />
{:then response}
	<TopCard nudgeData={response.nudges || []} />
	{#if data.pageParam?.accountNumber}
		<BottomCard bankDetail={selectedAccountDetail} {intiateAutoPayProcess} />
		<Mandate
			{selectedAccount}
			bind:this={mandateInstance}
			amount={String(getSipAmountWithoutMandate(response.nudges))}
			successButtonTitle="DONE"
		>
			<svelte:fragment slot="mandate-success">
				<MandateSuccessPopup />
			</svelte:fragment>
		</Mandate>
	{/if}
{/await}
