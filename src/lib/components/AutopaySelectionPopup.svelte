<script setup lang="ts">
	import BankAccountTile from '$components/BankAccountTile.svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import WmsIcon from './WMSIcon.svelte';
	import type { MandateWithBankDetails } from '$lib/types/IEmandate';

	export let selectedMandate: MandateWithBankDetails;
	export let mandateList: Array<MandateWithBankDetails> = [];
	export let onMandateChange: (payload: MandateWithBankDetails) => void = () => undefined;
	export let onClose = (): void => undefined;

	let selected = selectedMandate;

	const onChange = (mandate: MandateWithBankDetails) => {
		selected = mandate;
	};

	const onProceed = () => {
		onMandateChange(selected);
	};
</script>

<Modal on:backdropclicked={onClose} isModalOpen>
	<div class="w-full rounded-t-3xl bg-white sm:w-120 sm:rounded-lg {$$props.class}">
		<div class="ml-4 pb-4 pt-6 text-lg font-medium text-black-title">Select Autopay</div>
		<div class="flex flex-col pb-4">
			{#each mandateList as mandate, index (mandate.mandateId)}
				<BankAccountTile
					bankLogo={mandate.bankLogo}
					bankName={mandate.bankName}
					bankAccount={mandate.accountNo}
					showRadioButton
					identifier={index}
					selected={selected?.mandateId === mandate.mandateId}
					onSelect={() => onChange(mandate)}
					clazz="!border-0"
				>
					<svelte:fragment slot="bottomSection">
						<div class=" mt-2 text-2xs font-normal text-grey-body">
							Autopay Id: {mandate.mandateId}
						</div>
					</svelte:fragment>
				</BankAccountTile>
			{/each}
		</div>
		<div class=" mx-4 flex items-center rounded bg-blue-background p-2">
			<div class="info-icon-container">
				<WmsIcon
					width={20}
					height={20}
					name="info-in-circle-dark"
					class="info-in-circle-dark-icon"
				/>
			</div>
			<div class="ml-3 text-sm font-normal text-grey-body">
				If your SIP order is already in progress, autopay will be used from the next instalment
			</div>
		</div>
		<div class="px-4 pb-3 pt-5">
			<Button class="w-full rounded" onClick={onProceed}>CONFIRM</Button>
		</div>
		<slot name="loader" />
	</div>
</Modal>

<style>
	.info-icon-container :global(.info-in-circle-dark-icon path) {
		stroke: #3f5bd9;
	}
	.info-icon-container :global(.info-in-circle-dark-icon circle) {
		stroke: #3f5bd9;
	}
</style>
