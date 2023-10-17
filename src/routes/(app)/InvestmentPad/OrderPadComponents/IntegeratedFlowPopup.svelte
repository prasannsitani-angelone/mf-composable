<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import UpiMandateIcon from '$lib/images/icons/UPIMandateIcon.svelte';
	import Button from '$components/Button.svelte';

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

	const instructions = [
		'Autopay helps you make all your SIP payments automatically. Simply proceed and approve the payment mandate on your UPI app',
		'The autopay limit is ₹15,000',
		'Only the SIP amount will be debited from your bank account on the monthly SIP date',
		'You can cancel your SIP any time'
	];
</script>

<Modal isModalOpen>
	<div
		class="flex w-full flex-col items-center overflow-y-auto rounded-none rounded-t-2xl bg-white p-4 pt-8 shadow-clg sm:w-120 sm:rounded-lg"
	>
		<div class="text-2xl font-medium text-black-title">Start Your SIP with Autopay</div>
		<UpiMandateIcon class="mt-4 h-[195px] w-[258px]" />
		<div class="mt-4 flex flex-col gap-4">
			{#each instructions as instruction, index (index)}
				<div class="flex flex-row">
					<div class="mr-1.5 mt-1 h-2 w-2 min-w-[8px] rounded-full bg-black-title" />
					<div class="text-sm font-bold text-black-title">
						{instruction}
					</div>
				</div>
			{/each}
		</div>
		<div class="mt-4 flex w-full flex-col gap-2">
			<Button class="w-full" on:click={excecuteIntegeratedFlow}>Pay now and start sip</Button>
			<Button class="w-full" variant="transparent" on:click={excecuteNormalFlow}>
				Continue without autopay
			</Button>
		</div>
	</div>
</Modal>
