<script lang="ts">
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import { createEventDispatcher } from 'svelte';
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
	export let paymentOptionsHeading = '';

	export let onSelect = (): void => undefined;
	export let onSubmit = (): void => undefined;
	export let resetInputError = (): void => undefined;
	export let onChangeBank = (): void => undefined;
	export let allowedPaymentmethods = Object.keys(PAYMENT_MODE);
	export let asModal = true;

	const dispatch = createEventDispatcher();
	let isModalClosed = false;

	const closingModal = () => {
		dispatch('backClick');
		isModalClosed = false;
	};

	const onBackClick = () => {
		isModalClosed = true;
		setTimeout(() => {
			closingModal();
		}, 500);
	};
</script>

{#if asModal}
	<ModalWithAnimation isModalOpen={true} {isModalClosed}>
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
				{paymentOptionsHeading}
				class="sm:px-8 sm:py-8"
			/>
		</div>
	</ModalWithAnimation>
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
			{paymentOptionsHeading}
		/>
	</section>
{/if}
