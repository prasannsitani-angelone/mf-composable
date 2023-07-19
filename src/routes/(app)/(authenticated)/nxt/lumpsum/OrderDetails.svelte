<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$components/Button.svelte';
	import ChipArqRating from '$components/ChipArqRating.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import TncModal from '$components/TnC/TncModal.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { formatAmount } from '$lib/utils/helpers/formatAmount';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import type { IMandateDetails } from './type';
	import type { IOrderDetails } from '$lib/types/IOrderDetails';
	import type { BankDetailsEntity, UserProfile } from '$lib/types/IUserProfile';

	export let schemeDetails: SchemeDetails;
	export let mandateDetails: IMandateDetails;
	export let orderDetails: IOrderDetails;
	export let profileDetails: UserProfile;

	$: mandateType = mandateDetails?.mandateType === 'XSIP' ? 'Physical' : 'Digital';
	$: filteredBankAccounts = profileDetails?.bankAccounts()?.filter((item: BankDetailsEntity) => {
		if (item?.accNO && formatAmount(item?.accNO) === formatAmount(mandateDetails?.accountNo)) {
			return item;
		}
	});
	$: selectedBankAccount = filteredBankAccounts?.[0];

	let showTncModal = false;

	const dispatch = createEventDispatcher();

	const handleRequestOTP = () => {
		dispatch('showOtpModal');
	};
	const toggleTncModal = () => {
		showTncModal = !showTncModal;
	};
</script>

<div class="mt-3 rounded bg-white sm:mt-0">
	<p class="border-b p-4">Order Details</p>
	<div class="flex items-center gap-3 border-b p-6">
		<div
			class="flex h-12 w-16 items-center justify-center rounded-full border border-grey bg-white shadow-csm"
		>
			<img src={schemeDetails?.logoUrl} alt={schemeDetails?.schemeName} height="48" width="48" />
		</div>
		<div class="">
			<ChipOverview
				headingPrimary={schemeDetails?.categoryName}
				headingSecondary={schemeDetails?.reInvestmentPlan}
			/>
			<div class="text-lg font-normal">
				{schemeDetails?.schemeName}
			</div>
			<div class="flex items-center">
				<ChipArqRating class="py-1 text-xs" arqRating={schemeDetails?.arqRating} />
				<div class="ml-1 rounded bg-grey px-1">
					<span class="text-xs text-grey-body">{schemeDetails?.reInvestmentPlan}</span>
				</div>
			</div>
		</div>
	</div>
	<div class="border-b p-4">
		<div class="flex items-center gap-2">
			<p class="text-sm font-normal text-grey-body">One-Time Investment Amount</p>
		</div>
		<p class="text-2xl text-black-title">₹{orderDetails?.amount}</p>
	</div>
	<!-- Order Summary -->
	<section>
		<p class="border-b px-6 py-4 text-base font-normal text-black-title">Order Summary</p>
		<div class="px-6">
			<div class="flex justify-between py-[10px]">
				<span class="text-body-grey text-sm">Request Date</span>
				<span class="text-base text-black-title">{orderDetails?.requestDate}</span>
			</div>
			<div class="flex justify-between py-[10px]">
				<span class="text-body-grey text-sm">Payment Mode</span>
				<span class="text-base text-black-title">{mandateType} Autopay</span>
			</div>
			<div class="flex justify-between py-[10px]">
				<span class="text-body-grey text-sm">Autopay ID</span>
				<span class="text-base text-black-title">{mandateDetails?.mandateId}</span>
			</div>
		</div>
		<div class="p-4">
			<p class="pb-4 text-base text-black-title">
				Your amount will be debited within 3 days from below bank account
			</p>
			<div class="flex items-center border px-4 py-3">
				<div
					class="ml-2 mr-3 flex h-[30px] w-[46px] items-center justify-center rounded-sm border border-grey-line bg-white"
				>
					<img src={selectedBankAccount?.bankLogo} class="h-3 w-3" alt="bank logo" />
				</div>
				<div class="flex flex-col">
					<p class="text-sm text-black-title">{selectedBankAccount?.bankName}</p>
					<div class="text-sm text-grey-body">
						••••{selectedBankAccount?.accNO?.substr(selectedBankAccount?.accNO?.length - 4)}
					</div>
				</div>
			</div>
		</div>
	</section>
	<section class="rounded bg-white p-2 md:p-4">
		<div class="flex items-center gap-4 rounded bg-grey p-4">
			<WMSIcon name="message" width={25} height={24} />
			<div class="text-base text-grey-body">
				Your order will be authorised once you verify OTP. Your money will be debited within 3
				working days. Please ensure sufficient balance in your bank account. NAV will be based on
				fund realisation by AMC.
			</div>
		</div>
	</section>
	<div class="mx-4 flex flex-col items-center py-4">
		<Button variant="contained" class="w-full" ariaLabel="Request OTP" onClick={handleRequestOTP}
			>REQUEST OTP</Button
		>
		<p class="mx-auto mt-4 text-center">
			By proceeding, you accept AngelOne's
			<button class="text-blue-primary" on:click={toggleTncModal}>T&C</button>
		</p>
	</div>
</div>

{#if showTncModal}
	<!-- T&C Modal -->
	<TncModal showModal={showTncModal} on:closeModal={toggleTncModal} />
{/if}
