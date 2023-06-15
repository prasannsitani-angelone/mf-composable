<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import { PAYMENT_MODE } from './constants';
	import PaymentMethod from './PaymentMethod.svelte';
	import PaymentMethodHeader from './PaymentMethodHeader.svelte';

	export let amount = '';
	export let bankAccounts: Array<BankDetailsEntity> = [];
	export let selectedAccount: number;
	export let inputError = '';
	export let redirectedFrom = '';
	export let selectedMode = '';
	export let defaultInputVal = '';
	export let isLoading = false;
	export let isSchemeDisabled = false;

	export let onBackClick = (): void => undefined;
	export let onSelect = (): void => undefined;
	export let onSubmit = (): void => undefined;
	export let resetInputError = (): void => undefined;
	export let onChangeBank = (): void => undefined;
</script>

<Modal isModalOpen={true}>
	<div
		class="flex h-full w-full flex-col bg-white shadow-csm sm:h-max sm:max-h-[640px] sm:w-max sm:min-w-[490px]"
	>
		<PaymentMethodHeader {onBackClick} />
		<PaymentMethod
			paymentModes={Object.keys(PAYMENT_MODE)}
			{selectedMode}
			{onSelect}
			{onSubmit}
			{amount}
			{bankAccounts}
			{selectedAccount}
			{inputError}
			{resetInputError}
			{redirectedFrom}
			{defaultInputVal}
			onChangeBankClick={onChangeBank}
			{isLoading}
			{isSchemeDisabled}
			class="sm:px-8 sm:py-8"
		/>
	</div>
</Modal>
