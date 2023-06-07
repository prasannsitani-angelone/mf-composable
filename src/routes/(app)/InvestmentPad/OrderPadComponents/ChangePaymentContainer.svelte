<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import { page } from '$app/stores';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import PaymentMethodHeader from './PaymentMethodHeader.svelte';
	import PaymentMethod from '$components/Payment/PaymentMethod.svelte';
	import { PAYMENT_MODE } from '$components/Payment/constants';

	export let isSIP = false;
	export let dateSuperscript = '';
	export let calendarDate: number;
	export let amount = '';
	export let schemeName = '';
	export let bankAccounts: Array<BankDetailsEntity> = [];
	export let selectedAccount: number;
	export let inputError = '';
	export let redirectedFrom = '';
	export let selectedMode = '';
	export let defaultInputVal = '';
	export let isLoading = false;

	export let onBackClick = (): void => undefined;
	export let onSelect = (): void => undefined;
	export let onSubmit = (): void => undefined;
	export let resetInputError = (): void => undefined;
	export let onChangeBank = (): void => undefined;

	$: isMobile = $page?.data?.deviceType?.isMobile;
</script>

{#if isMobile}
	<Modal isModalOpen={true}>
		<div class="flex h-full w-full flex-col bg-white shadow-csm">
			<PaymentMethodHeader
				{isSIP}
				{dateSuperscript}
				{calendarDate}
				{amount}
				{schemeName}
				{onBackClick}
				clazz="shadow-csm"
			/>
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
			/>
		</div>
	</Modal>
{:else}
	<section class={`h-fit w-full rounded-lg bg-grey shadow-csm ${$$props?.class}`}>
		<slot name="header" />
		<PaymentMethodHeader
			{isSIP}
			{dateSuperscript}
			{calendarDate}
			{amount}
			{schemeName}
			{onBackClick}
			clazz="my-2"
		/>
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
		/>
	</section>
{/if}
