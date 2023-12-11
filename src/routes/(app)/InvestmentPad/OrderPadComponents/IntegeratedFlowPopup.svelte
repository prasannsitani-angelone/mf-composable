<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import UpiMandateIcon from '$lib/images/icons/UPIMandateIcon.svelte';
	import ButtonMedium from '$components/ButtonMedium.svelte';

	export let onClose = () => undefined;
	export let normalFlowFunc = () => undefined;
	export let integeratedFlowFunc = () => undefined;

	const excecuteIntegeratedFlow = () => {
		integeratedFlowFunc();
		onClose();
	};

	const excecuteNormalFlow = () => {
		normalFlowFunc();
		onClose();
	};
</script>

<Modal isModalOpen on:backdropclicked={onClose}>
	<div
		class="flex w-full flex-col items-center overflow-y-auto rounded-none rounded-t-2xl bg-white p-4 pt-8 shadow-clg sm:w-120 sm:rounded-lg"
	>
		<div class="text-2xl font-medium text-black-title">Start Your SIP with Autopay</div>
		<UpiMandateIcon class="mt-4 h-[195px] w-[258px]" />
		<div class="mt-4 flex flex-col gap-4">
			<div class="flex flex-row">
				<div class="mr-1.5 mt-1 h-2 w-2 min-w-[8px] rounded-full bg-black-title" />
				<div class="text-sm font-normal text-black-title">
					Autopay helps you make all your SIP payments automatically. Simply proceed and <span
						class="font-medium">approve the payment mandate</span
					> on your UPI app
				</div>
			</div>
			<div class="flex flex-row">
				<div class="mr-1.5 mt-1 h-2 w-2 min-w-[8px] rounded-full bg-black-title" />
				<div class="text-sm font-normal text-black-title">The autopay limit is ₹15,000</div>
			</div>
			<div class="flex flex-row">
				<div class="mr-1.5 mt-1 h-2 w-2 min-w-[8px] rounded-full bg-black-title" />
				<div class="text-sm font-normal text-black-title">
					<span class="font-medium">Only the SIP amount will be debited</span> from your bank account
					on the monthly SIP date
				</div>
			</div>
			<div class="flex flex-row">
				<div class="mr-1.5 mt-1 h-2 w-2 min-w-[8px] rounded-full bg-black-title" />
				<div class="text-sm font-normal text-black-title">You can cancel your SIP any time</div>
			</div>
		</div>
		<div class="mt-4 flex w-full flex-col gap-2">
			<ButtonMedium class="w-full" on:click={excecuteIntegeratedFlow}
				>Pay now and start sip</ButtonMedium
			>
			<ButtonMedium class="w-full" variant="transparent" on:click={excecuteNormalFlow}>
				Continue without autopay
			</ButtonMedium>
		</div>
	</div>
</Modal>
