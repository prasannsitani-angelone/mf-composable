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
	export let bankLogo = '';
	export let bankName = '';
	export let accNO = '';

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
		class="flex h-full flex-col items-center justify-between overflow-y-auto bg-background-alt shadow-clg sm:h-max sm:w-120 sm:rounded-lg"
	>
		<div class="flex w-full flex-col-reverse p-4 sm:flex-row sm:border-b sm:border-border sm:p-8">
			<div class="mt-10 flex flex-1 flex-col items-center font-normal text-title sm:mt-0">
				<div class="mb-6 w-8/12 text-center text-base sm:text-lg">
					Please Approve Payment on your UPI App
				</div>
				<div class="mb-6 text-4xl">
					{`₹${addCommasToAmountString(amount)}`}
				</div>
				<div class="flex w-max flex-col justify-center rounded bg-background px-8 py-3">
					<div class="mb-2 text-center text-xs text-title sm:text-body">Approve Payment Within</div>
					<div class="text-center text-lg font-medium sm:text-xl sm:font-normal">
						{timeToDisplay}
					</div>
				</div>
				{#if accNO}
					<div class="mt-14 flex flex-col items-center">
						<img src={bankLogo} class="mb-4 h-16 w-16" alt="bank logo" />
						<div class="flex flex-row text-base font-normal text-title">
							Use
							<div class="ml-2 flex flex-row font-normal">
								<span>{bankName}</span>
								<div class="ml-1 flex flex-row items-center">
									<div class="mr-1 h-1 w-1 rounded-full bg-title" />
									<div class="mr-1 h-1 w-1 rounded-full bg-title" />
									<div class="mr-1 h-1 w-1 rounded-full bg-title" />
									<div class="mr-1 h-1 w-1 rounded-full bg-title" />
									{accNO?.substring(accNO.length - 4)}
								</div>
							</div>
						</div>
					</div>
				{/if}

				<div class="mt-5 text-xs text-body">
					It can take up to 10 seconds to get a notification on your UPI app
				</div>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={onClose}>
				<CrossInCircleIcon />
			</div>
		</div>

		<div class="bg-background p-4 sm:p-8">
			<div class="mb-5 text-sm font-normal text-title">UPI Payment Instructions</div>
			{#each intstructions as instruction, index (index)}
				<div class="mb-3 flex flex-row">
					<svelte:component this={instruction.icon} />
					<div class="ml-4 w-11/12 text-sm text-body">
						{instruction.message}
					</div>
				</div>
			{/each}
		</div>
	</div>
</Modal>
