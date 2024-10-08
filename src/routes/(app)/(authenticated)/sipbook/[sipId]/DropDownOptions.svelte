<script lang="ts">
	import { page } from '$app/stores';
	import { SIP_OPTIONS } from '$lib/constants/sipBook';
	import Button from '$components/Button.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { WMSIcon } from 'svelte-components';
	import { threeDotsPopup } from '$lib/analytics/sipbook/sipbook';
	$: isMobile = $page.data.deviceType.isMobile;

	let isSipInprocess: boolean;
	let installmentSkip: boolean;
	let isSipPaymentNudge: boolean;
	let sipType: string;
	let packId: string;
	const dispatch = createEventDispatcher();

	const onOptionSelect = (key: string) => {
		dispatch('onButtonClick', { key });
	};
	export { isSipInprocess, installmentSkip, isSipPaymentNudge, sipType, packId };

	onMount(() => {
		let activeFields = '';
		if (!isSipInprocess) {
			activeFields = activeFields + 'cancelSIP';
			if (sipType === 'SIP') {
				activeFields = activeFields + ' ,editSIP';
				if (!(installmentSkip || isSipPaymentNudge)) {
					activeFields = activeFields + ' ,skipSIP';
				}
			}
		}
		threeDotsPopup({ activeFields: activeFields, porfolioModificationtext: packId ? 'Y' : 'N' });
	});
</script>

<div
	class={isMobile
		? 'flex w-screen flex-col rounded-b-none rounded-t-2xl bg-background-alt py-2 shadow-csm md:rounded-lg'
		: 'z-1 absolute -top-5 right-0 flex w-[42%] flex-col rounded-md border-b bg-background-alt shadow-csm'}
>
	{#each SIP_OPTIONS as option}
		{#if sipType === 'SIP' || (sipType === 'XSIP' && option.key === 'cancelSip')}
			{@const isDisabled =
				isSipInprocess || (option.key === 'skipSip' && (installmentSkip || isSipPaymentNudge))}
			<div class="flex w-full self-start px-4 py-2">
				<Button
					size={isDisabled ? 'lg' : 'md'}
					variant="transparent"
					class={`w-full !justify-start !font-normal !text-title ${
						isDisabled
							? 'pointer-events-none !-ml-2 !cursor-not-allowed border-disabled !bg-background-alt !text-disabled grayscale'
							: ''
					}`}
					onClick={() => {
						onOptionSelect(option.key);
					}}
				>
					<div class="flex flex-col text-left normal-case">
						<div class="flex {isSipInprocess ? 'text-disabled' : ''}">
							<div class="pr-4 {isDisabled ? 'grayscale' : ''}">
								<WMSIcon
									name={option.logo}
									stroke={isSipInprocess ? 'var(--DISABLED)' : 'var(--PRIMARY)'}
									strokeround={isSipInprocess ? 'var(--BACKGROUND-ALT)' : 'var(--PRIMARY)'}
									strokecircle={isSipInprocess ? 'var(--DISABLED)' : 'var(--TINT24-PRIMARY)'}
								/>
							</div>
							<div>
								{option.name}
								{#if isSipInprocess}
									<div class="flex text-xs text-disabled">
										{option.shortName} SIP is not available. Your SIP order is already in progress.
									</div>
								{:else if option.key === 'skipSip' && (installmentSkip || isSipPaymentNudge)}
									<div class="flex pt-2 text-xs">
										Skip SIP is not available. {installmentSkip
											? 'You have already skipped your next SIP instalment.'
											: 'Please complete the payment for your current SIP instalment.'}
									</div>
								{/if}
							</div>
						</div>
					</div>
				</Button>
			</div>
		{/if}
	{/each}
	{#if packId}
		<div class="light mx-6 mb-2 flex rounded-lg bg-[#FEEED4] p-4 text-title">
			<div>
				<WMSIcon name="info-doughnut" fill="#FACE80" />
			</div>
			<div class="pl-2 text-xs text-title">
				This SIP is part of a goal based portfolio. Editing this SIP might impact your portfolio
				performance
			</div>
		</div>
	{/if}
</div>
