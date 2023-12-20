<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import type { MandateWithBankDetails } from '$lib/types/IEmandate';
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
	export let autopayOptions: MandateWithBankDetails[] = [];

	export let onBackClick = (): void => undefined;
	export let onSelect = (): void => undefined;
	export let onSubmit = (): void => undefined;
	export let resetInputError = (): void => undefined;
	export let onChangeBank = (): void => undefined;
	export let allowedPaymentmethods = Object.keys(PAYMENT_MODE);
	export let asModal = true;
</script>

{#if asModal}
	<Modal isModalOpen={true}>
		<div
			class="flex h-full w-full flex-col bg-white shadow-csm sm:h-max sm:max-h-[640px] sm:w-max sm:min-w-[490px]"
		>
			<PaymentMethodHeader {onBackClick} isPartOfModal />
			<slot name="schemeTile" />
			<slot name="autopayMethods" />
			<PaymentMethod
				paymentModes={allowedPaymentmethods}
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
				{autopayOptions}
				class="sm:px-8 sm:py-8"
			/>
		</div>
	</Modal>
{:else}
	<section class={`h-fit w-full bg-white ${$$props?.class} !flex flex-col`}>
		<PaymentMethodHeader {onBackClick} />
		<slot name="schemeTile" />
		<slot name="autopayMethods" />
		<PaymentMethod
			paymentModes={allowedPaymentmethods}
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
		/>
	</section>
{/if}
