<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import { intervalToDuration } from 'date-fns';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import NotCircleIcon from './icons/NotCircleIcon.svelte';
	import CrossBoxCircle from './icons/CrossBoxCircle.svelte';
	import TickMessageCircle from './icons/TickMessageCircle.svelte';
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';

	export let amount = '';
	export let timer: number;
	export let onClose = (): void => undefined;

	const intstructions = [
		{
			icon: TickMessageCircle,
			message: 'Open your UPI app and confirm the payment request from Angel One'
		},
		{
			icon: CrossBoxCircle,
			message: 'Please do not press back or close this window before approving the payment'
		},
		{
			icon: NotCircleIcon,
			message: 'You may close this window after approving the payment in your UPI app'
		}
	];

	let timeToDisplay: string;
	$: {
		const duration = intervalToDuration({ start: 0, end: timer * 1000 });
		const zeroPad = (num?: number) => String(num).padStart(2, '0');
		timeToDisplay = `${zeroPad(duration.minutes)} : ${zeroPad(duration.seconds)}`;
	}
</script>

<Modal isModalOpen>
	<div
		class="flex h-full flex-col items-center justify-between overflow-y-auto bg-white shadow-clg sm:h-max sm:w-120 sm:rounded-lg"
	>
		<div
			class="flex w-full flex-col-reverse px-4 pt-6 sm:flex-row sm:border-b sm:border-grey-line sm:px-8 sm:pb-10"
		>
			<div class="mt-10 flex flex-1 flex-col items-center font-medium text-black-title sm:mt-4">
				<div class="mb-4 w-8/12 text-center text-base sm:mb-6 sm:text-lg">
					Please Approve Payment on your UPI App
				</div>
				<div class="mb-20 text-4xl sm:mb-6">
					{`₹${addCommasToAmountString(amount)}`}
				</div>
				<div class="flex w-max flex-col justify-center rounded bg-grey py-3 px-8">
					<div class="mb-2 text-center text-xs text-black-title sm:text-grey-body">
						Approve Payment Within
					</div>
					<div class="text-center text-lg font-semibold sm:text-xl sm:font-medium">
						{timeToDisplay}
					</div>
				</div>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={onClose}>
				<CrossInCircleIcon />
			</div>
		</div>

		<div class="px-4 pb-6 sm:px-8 sm:py-6">
			<div class="mb-5 text-sm font-medium text-black-title">UPI Payment Instructions</div>
			{#each intstructions as instruction, index (index)}
				<div class="mb-3 flex flex-row">
					<svelte:component this={instruction.icon} />
					<div class="ml-4 w-11/12 text-sm text-grey-body">
						{instruction.message}
					</div>
				</div>
			{/each}
		</div>
	</div>
</Modal>
