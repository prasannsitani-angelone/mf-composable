<script lang="ts">
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import { page } from '$app/stores';
	import { EMANDATE_MODE } from '../constants';
	import PaymentTile from '$components/Payment/PaymentTile.svelte';

	export let selectedMode = '';
	export let emandateModes: Array<string> = [];
	export let amount = '';
	export let bankAccounts: Array<BankDetailsEntity> = [];
	export let selectedAccount: number;
	export let inputError = '';
	export let defaultInputVal = '';
	export let isLoading = false;

	export let onSelect: (payload: string) => void = () => undefined;
	export let onSubmit = (): void => undefined;
	export let onChangeBankClick = (): void => undefined;
	export let resetInputError = (): void => undefined;

	$: os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;
</script>

<div
	class="flex flex-col overflow-y-scroll rounded-lg bg-background-alt px-4 py-3 shadow-csm {$$props.class}"
>
	<div class="mb-3 text-sm font-normal text-title">Set Up Autopay With</div>
	<div class="divide-y divide-border rounded-lg border">
		{#each emandateModes as emandateModeKey (emandateModeKey)}
			{#if EMANDATE_MODE[emandateModeKey].enabled(os)}
				<PaymentTile
					selected={selectedMode === emandateModeKey}
					identifier={emandateModeKey}
					{onSelect}
					{onSubmit}
					showInput={EMANDATE_MODE[emandateModeKey].showInput}
					{inputError}
					{resetInputError}
					bankAccount={bankAccounts[selectedAccount]?.accNO}
					bankName={bankAccounts[selectedAccount]?.bankName}
					bankLogo={bankAccounts[selectedAccount]?.bankLogo}
					{amount}
					showChangeBank={bankAccounts.length > 1}
					defaultInputVal={defaultInputVal || ''}
					{isLoading}
					changeBank={onChangeBankClick}
					class="first:rounded-t-lg last:rounded-b-lg"
					innerClass="sm:w-max"
					submitButtonText="PROCEED"
					extraInfoText="Use the same bank account on your UPI app"
				>
					<svelte:component this={EMANDATE_MODE[emandateModeKey].logo} slot="icon" />
					<div slot="content">
						{EMANDATE_MODE[emandateModeKey].name}
					</div>
				</PaymentTile>
			{/if}
		{/each}
	</div>
</div>
