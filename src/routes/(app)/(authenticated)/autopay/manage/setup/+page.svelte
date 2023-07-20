<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { tick } from 'svelte';
	import TopCard from './components/TopCard.svelte';
	import BottomCard from './components/BottomCard.svelte';
	import Mandate from '$components/mandate/Mandate.svelte';
	import { getSipAmountWithoutMandate } from '../utils';
	import MandateSuccessPopup from './components/MandateSuccessPopup.svelte';
	import type { BankDetailsEntity, UserProfile } from '$lib/types/IUserProfile';
	import SetupSkeletanLoader from './components/SetupSkeletanLoader.svelte';
	import {
		selectedAutopayMethodImpression,
		proceedToAutoPayCreationAnalytics,
		autopayFailedScreenAnalytics
	} from '$lib/analytics/setupAutopay/autopay';

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
		const response = await data.api.data;
		const amount = getSipAmountWithoutMandate(response.nudges);
		const eventMetaData = {
			ModeofAutopay: 'Debit/Netbanking',
			CurrentSIP: amount,
			Autopaylimit: '100000'
		};
		proceedToAutoPayCreationAnalytics(eventMetaData);
		await tick();
		mandateInstance?.startProcess(true);
	};

	$: setupBankDetails(profileData);

	const onAutopaySetupFail = () => {
		autopayFailedScreenAnalytics();
	};

	onMount(async () => {
		const response = await data.api.data;
		const amount = getSipAmountWithoutMandate(response.nudges);
		const eventMetaData = {
			ModeofAutopay: 'Debit/Netbanking',
			CurrentSIP: amount,
			Autopaylimit: '100000'
		};
		selectedAutopayMethodImpression(eventMetaData);
	});
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
			displayErrorCallback={onAutopaySetupFail}
		>
			<svelte:fragment slot="mandate-success">
				<MandateSuccessPopup />
			</svelte:fragment>
		</Mandate>
	{/if}
{/await}
