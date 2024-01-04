<script setup lang="ts">
	import Button from './Button.svelte';
	import WmsIcon from './WMSIcon.svelte';
	import type { MandateWithBankDetails } from '$lib/types/IEmandate';
	import { profileStore } from '$lib/stores/ProfileStore';
	import PaymentTile from '$components/Payment/PaymentTile.svelte';
	import ModalWithAnimation from './ModalWithAnimation.svelte';

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

<ModalWithAnimation on:backdropclicked={onClose} isModalOpen>
	<div class="w-full rounded-t-3xl bg-white sm:w-120 sm:rounded-lg {$$props.class}">
		<div class="ml-4 pb-4 pt-6 text-lg font-normal text-black-title">Select Autopay</div>
		<div class="flex flex-col pb-4">
			{#each mandateList as mandate, index (mandate.mandateId)}
				{@const logoIcon = profileStore.getBankDetailsByAccountNumber(mandate.accountNo)?.bankLogo}
				<PaymentTile
					selected={selected?.mandateId === mandate.mandateId}
					onSelect={() => onChange(mandate)}
					showExtraInfo={false}
					class="first:rounded-t-lg last:rounded-b-lg"
				>
					<div slot="icon" class="flex h-8 w-11 items-center justify-center rounded-sm">
						<img src={logoIcon} class="h-4 w-4" alt="bank logo" />
					</div>
					<div slot="content" class="mt-2 flex flex-col text-2xs font-normal text-grey-body">
						<div class="flex">
							<div class="mr-2 flex flex-row">
								<div class="text-sm font-normal text-black-title">
									{mandate.bankName}
								</div>
							</div>

							<div class="mt-1 flex flex-row items-center text-xs font-normal text-black-key">
								{#each Array(4) as i}
									<div class="mr-1 h-1 w-1 rounded-full bg-black-key" />
								{/each}
								{mandate.accountNo?.substring(mandate.accountNo.length - 4)}
							</div>
						</div>
						<div class="w-56 truncate text-left text-[11px]">
							<span class="uppercase">{mandate.authenticationMode} AUTOPAY</span> | Autopay ID: {mandate.mandateId}
						</div>
					</div>
				</PaymentTile>
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
			<slot name="infoText">
				<div class="ml-3 text-sm font-normal text-grey-body">
					If your order is already in progress, switched Autopay will be used from the next
					instalment
				</div>
			</slot>
		</div>
		<div class="px-4 pb-3 pt-5">
			<Button class="w-full rounded" onClick={onProceed}>CONFIRM</Button>
		</div>
		<slot name="loader" />
	</div>
</ModalWithAnimation>

<style>
	.info-icon-container :global(.info-in-circle-dark-icon path) {
		stroke: #3f5bd9;
	}

	.info-icon-container :global(.info-in-circle-dark-icon circle) {
		stroke: #3f5bd9;
	}
</style>
