<script lang="ts">
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import PaymentTile from './PaymentTile.svelte';
	import { PAYMENT_MODE } from './constants';
	import { stringToFloat } from '$lib/utils/helpers/numbers';
	import { page } from '$app/stores';

	export let selectedMode = '';
	export let paymentModes: Array<string> = [];
	export let amount = '';
	export let bankAccounts: Array<BankDetailsEntity> = [];
	export let selectedAccount: number;
	export let inputError = '';
	export let redirectedFrom = '';
	export let defaultInputVal = '';
	export let isLoading = false;
	export let isSchemeDisabled = false;

	export let onSelect: (payload: string) => void = () => undefined;
	export let onSubmit = (): void => undefined;
	export let onChangeBankClick = (): void => undefined;
	export let resetInputError = (): void => undefined;

	const amountInNumber: number = stringToFloat(amount);
	$: os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;
</script>

<div class="flex flex-col overflow-y-scroll bg-white px-4 py-3 {$$props.class}">
	<div class="mb-3 text-sm font-medium text-black-title">Pay With</div>
	<div class="divide-y divide-grey-line overflow-hidden rounded-lg border border-grey-line">
		{#each paymentModes as paymentModeKey (paymentModeKey)}
			{#if PAYMENT_MODE[paymentModeKey].enabled(amountInNumber, os, redirectedFrom)}
				<PaymentTile
					selected={selectedMode === paymentModeKey}
					identifier={paymentModeKey}
					{onSelect}
					{onSubmit}
					showInput={PAYMENT_MODE[paymentModeKey].showInput}
					{inputError}
					{resetInputError}
					bankAccount={bankAccounts[selectedAccount]?.accNO}
					bankName={bankAccounts[selectedAccount]?.bankName}
					bankLogo={bankAccounts[selectedAccount]?.bankLogo}
					{amount}
					showChangeBank={bankAccounts.length > 1}
					defaultInputVal={defaultInputVal || ''}
					{isLoading}
					{isSchemeDisabled}
					changeBank={onChangeBankClick}
				>
					<svelte:component this={PAYMENT_MODE[paymentModeKey].logo} slot="icon" />
					<div slot="content">
						{PAYMENT_MODE[paymentModeKey].name}
					</div>
				</PaymentTile>
			{/if}
		{/each}
	</div>
</div>
