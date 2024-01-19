<script lang="ts">
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import PaymentTile from './PaymentTile.svelte';
	import { stringToFloat } from '$lib/utils/helpers/numbers';
	import { page } from '$app/stores';
	import type { MandateWithBankDetails } from '$lib/types/IEmandate';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { paymentMethodStatusStore } from '$lib/stores/PaymentMethodStatusStore';

	export let selectedMode = '';
	export let subIdentifier = '';
	export let amount = '';
	export let bankAccounts: Array<BankDetailsEntity> = [];
	export let selectedAccount: number;
	export let isLoading = false;
	export let autopayOptions: MandateWithBankDetails[] = [];

	export let onSelect: (payload: string, subIdentifier: string) => void = () => undefined;
	export let onSubmit = (identifier: string, subIdentifier: string): void => undefined;

	const amountInNumber: number = stringToFloat(amount);
	$: os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;

	$: paymentModesStatus =
		$paymentMethodStatusStore?.payment_modes?.[`${bankAccounts[selectedAccount]?.ifscCode}`] || {};
</script>

<div class="flex flex-col bg-white px-4 py-3 {$$props.class}">
	<div class="mb-3 text-sm font-normal text-black-title">Pay With Autopay</div>
	<div class="divide-y divide-grey-line rounded-lg border border-grey-line">
		{#each autopayOptions as option (option)}
			{@const logoIcon = profileStore.getBankDetailsByAccountNumber(option.accountNo)?.bankLogo}
			{#if amountInNumber <= option.availableAmount}
				<PaymentTile
					selected={selectedMode === 'AUTOPAY' && option.mandateId === subIdentifier}
					identifier={'AUTOPAY'}
					subIdentifier={option.mandateId}
					{onSelect}
					{onSubmit}
					{amount}
					{isLoading}
					{paymentModesStatus}
					showExtraInfo={false}
					submitButtonText={'START SIP'}
					class="first:rounded-t-lg last:rounded-b-lg"
				>
					<div slot="icon" class="flex h-8 w-11 items-center justify-center rounded-sm">
						<img src={logoIcon} class="h-4 w-4" alt="bank logo" />
					</div>
					<div slot="content" class="mt-2 flex flex-col text-2xs font-normal text-grey-body">
						<div class="flex">
							<div class="mr-2 flex flex-row">
								<div class="text-sm font-normal text-black-title">
									{option.bankName}
								</div>
							</div>

							<div class="mt-1 flex flex-row items-center text-xs font-normal text-black-key">
								<div class="mr-1 h-1 w-1 rounded-full bg-black-key" />
								<div class="mr-1 h-1 w-1 rounded-full bg-black-key" />
								<div class="mr-1 h-1 w-1 rounded-full bg-black-key" />
								<div class="mr-1 h-1 w-1 rounded-full bg-black-key" />
								{option.accountNo?.substring(option.accountNo.length - 4)}
							</div>
						</div>
						<div class="w-48 truncate text-left text-[11px]">
							<span class="uppercase">{option.authenticationMode} AUTOPAY</span> | Autopay ID: {option.mandateId}
						</div>
					</div>
				</PaymentTile>
			{/if}
		{/each}
	</div>
</div>
