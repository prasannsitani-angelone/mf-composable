<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { Button } from 'svelte-components';
	import Modal from '$components/Modal.svelte';
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import {
		autopayBankSelectionAnalytics,
		bankSelectionModalImpressionAnalytics,
		confirmBankSelectionAnalytics,
		autopayRiskImpressionAnalytics,
		setupAutopayButtonClickAnalytics
	} from '../../analytics/autopay';

	import type { UserProfile } from '$lib/types/IUserProfile';
	import BankTile from './BankTile.svelte';

	export let totalAmount: number;

	let bankPopupVisible = false;
	let whyThisBankPopupVisible = false;
	let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: ''
	};

	let bankLogo: string | undefined = '';
	let bankName: string | undefined = '';
	let bankAccount: string | undefined = '';

	$: profileData = $page?.data?.profile;

	const setupBankDetails = (profileDetail: UserProfile) => {
		const bankList = profileDetail.bankDetails;
		bankLogo = bankList?.[0]?.bankLogo;
		bankName = bankList?.[0]?.bankName;
		bankAccount = bankList?.[0]?.accNO;
	};

	$: setupBankDetails(profileData);

	const onAccountChange = (index: number) => {
		const bankList = profileData.bankDetails;
		paymentHandler.selectedAccount = index;
		bankLogo = bankList[index]?.bankLogo;
		bankName = bankList[index]?.bankName;
		bankAccount = bankList[index]?.accNO;
		confirmBankSelectionAnalytics();
	};

	const closeWhyThisBank = () => {
		whyThisBankPopupVisible = false;
	};
	const openWhyThisBank = () => {
		whyThisBankPopupVisible = true;
	};
	const showBankSelectionPopup = () => {
		if (profileData?.bankDetails?.length <= 1) {
			return;
		}
		const eventMetaData = { BankName: bankName };
		autopayBankSelectionAnalytics(eventMetaData);
		bankPopupVisible = true;
		bankSelectionModalImpressionAnalytics();
	};
	const hideBankSelectionPopup = () => {
		bankPopupVisible = false;
	};

	const navigatToSetup = async () => {
		const params = encodeObject({
			acc: bankAccount
		});
		const eventMetaData = {
			BankName: bankName,
			Message: `Your SIPs worth ₹${addCommasToAmountString(totalAmount)} are at risk`
		};
		setupAutopayButtonClickAnalytics(eventMetaData);
		await goto(`${base}/autopay/manage/setup?params=${params}`);
	};

	onMount(() => {
		const bankList = profileData?.bankDetails;
		const bankName = bankList?.[0]?.bankName;
		const eventMetaData = {
			Message: `Your SIPs worth ₹${addCommasToAmountString(totalAmount)} are at risk`,
			BankName: bankName
		};
		autopayRiskImpressionAnalytics(eventMetaData);
	});
</script>

<BankTile
	{bankLogo}
	{bankName}
	selectedBankAccount={bankAccount}
	{showBankSelectionPopup}
	bankAccounts={profileData?.bankDetails?.length}
	{openWhyThisBank}
	showWhyThisBank={true}
/>
<section>
	<Button on:click={navigatToSetup} class="w-full">SET UP AUTOPAY</Button>
</section>
{#if bankPopupVisible}
	<BankSelectionPopup
		bankAccounts={profileData?.bankDetails}
		selectedAccount={paymentHandler?.selectedAccount}
		{onAccountChange}
		onClose={hideBankSelectionPopup}
	/>
{/if}
{#if whyThisBankPopupVisible}
	<Modal closeModal={closeWhyThisBank} isModalOpen>
		<div
			class=" w-screen justify-between rounded-b-none rounded-t-2xl bg-white p-4 text-left sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-8"
		>
			<div class=" pb-6 pt-2 text-lg font-normal text-black-title">Why this bank?</div>

			<div class=" text-sm font-normal text-grey-body">
				Your autopay will be created in your selected bank account. <br />Your money will be debited
				from this bank account on SIP day after you successfully create an autopay.
			</div>
		</div>
	</Modal>
{/if}
