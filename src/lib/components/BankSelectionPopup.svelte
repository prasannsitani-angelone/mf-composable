<script setup lang="ts">
	import BankAccountTile from '$components/BankAccountTile.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import Button from './Button.svelte';
	import ModalWithAnimation from './ModalWithAnimation.svelte';

	export let selectedAccount: number;
	export let bankAccounts: Array<BankDetailsEntity> = [];
	export let onAccountChange: (payload: number) => void = () => undefined;
	export let onClose = (): void => undefined;

	let selected = selectedAccount;

	const onChange = (index: number) => {
		selected = index;
	};

	const onProceed = () => {
		onAccountChange(selected);
		onClose();
	};
</script>

<ModalWithAnimation on:backdropclicked={onClose} isModalOpen>
	<div class="w-full rounded-t-3xl bg-white sm:w-120 sm:rounded-lg">
		<div class="ml-4 pb-4 pt-6 text-lg font-normal text-black-title">Select Bank Account</div>
		<div class="flex flex-col pb-4">
			{#each bankAccounts as bankAccount, index (bankAccount.accNO)}
				<BankAccountTile
					bankLogo={bankAccount.bankLogo}
					bankName={bankAccount.bankName}
					bankAccount={bankAccount.accNO}
					showRadioButton
					identifier={index}
					selected={selected === index}
					onSelect={onChange}
					clazz="!border-0"
				/>
			{/each}
		</div>
		<div class="px-4 py-3">
			<Button class="w-full rounded" onClick={onProceed}>CONFIRM</Button>
		</div>
	</div>
</ModalWithAnimation>
