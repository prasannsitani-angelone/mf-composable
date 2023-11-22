<script lang="ts">
	import { page } from '$app/stores';
	import { SIP_OPTIONS } from '$lib/constants/sipBook';
	import Button from '$components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { WMSIcon } from 'svelte-components';
	$: isMobile = $page.data.deviceType.isMobile;

	let isSipInprocess: boolean;
	let installmentSkip: boolean;
	let isSipPaymentNudge: boolean;
	let sipType: string;
	const dispatch = createEventDispatcher();

	const onOptionSelect = (key: string) => {
		dispatch('onButtonClick', { key });
	};
	export { isSipInprocess, installmentSkip, isSipPaymentNudge, sipType };
</script>

<div
	class={isMobile
		? 'animate-bottomTransition flex w-screen flex-col rounded-b-none rounded-t-2xl bg-white py-2 shadow-csm md:animate-none md:rounded-lg'
		: 'z-1 absolute -top-5 right-0 flex w-[42%] flex-col rounded-md border-b bg-white shadow-csm'}
>
	{#each SIP_OPTIONS as option}
		{#if sipType === 'SIP' || (sipType === 'XSIP' && option.key === 'cancelSip')}
			{@const isDisabled =
				isSipInprocess || (option.key === 'skipSip' && (installmentSkip || isSipPaymentNudge))}
			<div class="flex self-start px-4 py-2">
				<Button
					size={isDisabled ? 'lg' : 'md'}
					variant="transparent"
					class={`w-full !font-normal !text-black-key ${
						isDisabled
							? 'pointer-events-none !-ml-2 !cursor-not-allowed border-grey-disabled !bg-white !text-grey-disabled grayscale'
							: ''
					}`}
					onClick={() => {
						onOptionSelect(option.key);
					}}
				>
					<div class="flex flex-col text-left normal-case">
						<div class="flex">
							<div class="pr-4 {isDisabled ? 'grayscale' : ''}">
								<WMSIcon name={option.logo} />
							</div>
							<div>
								{option.name}
							</div>
						</div>
						{#if isSipInprocess}
							<div class="flex pt-2 text-xs">
								{option.shortName} SIP is not available. Your SIP order is already in progress.
							</div>
						{/if}
						{#if option.key === 'skipSip' && (installmentSkip || isSipPaymentNudge)}
							<div class="flex pt-2 text-xs">
								Skip SIP is not available. {installmentSkip
									? 'You have already skipped your next SIP instalment.'
									: 'Please complete the payment for your current SIP instalment.'}
							</div>
						{/if}
					</div>
				</Button>
			</div>
		{/if}
	{/each}
</div>
