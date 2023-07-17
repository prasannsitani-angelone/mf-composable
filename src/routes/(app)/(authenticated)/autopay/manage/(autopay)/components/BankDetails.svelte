<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import WmsIcon from '$components/WMSIcon.svelte';
	import { Button } from 'svelte-components';
	import Modal from '$components/Modal.svelte';
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';

	let bankPopupVisible = false;
	let whyThisBankPopupVisible = false;
	let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: ''
	};

	let bankLogo = '';
	let bankName = '';
	let bankAccount = '';

	$: profileData = $page?.data?.profile;

	const setupBankDetails = (profileDetail) => {
		const bankList = profileDetail.bankDetails;
		bankLogo = bankList[0]?.bankLogo;
		bankName = bankList[0]?.bankName;
		bankAccount = bankList[0]?.accNO;
	};

	$: setupBankDetails(profileData);

	const onAccountChange = (index: number) => {
		const bankList = profileData.bankDetails;
		paymentHandler.selectedAccount = index;
		bankLogo = bankList[index]?.bankLogo;
		bankName = bankList[index]?.bankName;
		bankAccount = bankList[index]?.accNO;
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
		bankPopupVisible = true;
	};
	const hideBankSelectionPopup = () => {
		bankPopupVisible = false;
	};

	const navigatToSetup = async () => {
		const params = encodeObject({
			acc: bankAccount
		});

		await goto(`${base}/autopay/manage/setup?params=${params}`);
	};
</script>

<section class="mb-2 flex justify-between rounded border border-grey-line py-2.5">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click={showBankSelectionPopup} class="flex items-center">
		<div class="flex h-8 w-11 items-center justify-center rounded-sm">
			<img src={bankLogo} class="h-5 w-5" alt="bank logo" />
		</div>
		<div class="ml-1">
			<div class="flex flex-row items-start">
				<div class="flex items-center text-sm font-medium text-black-title">
					<div>{bankName}</div>
					{#if profileData?.bankDetails?.length > 1}
						<div class="ml-1 min-w-[12px] flex-1">
							<WmsIcon name="arrow-collapse" height={8} width={10} />
						</div>
					{/if}
				</div>
			</div>

			<div class="mt-1 flex flex-row items-center text-xs font-medium text-grey-body">
				<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
				<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
				<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
				<div class="mr-1 h-1 w-1 rounded-full bg-grey-body" />
				{bankAccount?.substring(bankAccount.length - 4)}
			</div>
		</div>
	</div>
	<Button
		class=" !text-xs !font-medium normal-case text-blue-primary"
		variant="transparent"
		on:click={openWhyThisBank}>Why this bank?</Button
	>
</section>
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
			<div class=" pb-6 pt-2 text-lg font-medium text-black-title">Why this bank?</div>

			<div class=" text-sm font-normal text-grey-body">
				Your autopay will be created in your selected bank account. <br />Your money will be debited
				from this bank account on SIP day after you successfully create an autopay.
			</div>
		</div>
	</Modal>
{/if}
