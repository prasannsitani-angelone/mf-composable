<script lang="ts">
	import Button from '$components/Button.svelte';
	import CautionIcon from '$lib/images/icons/CautionIcon.svelte';
	import LockedIcon from '$lib/images/icons/LockedIcon.svelte';
	import ThreeVerticalDotsIcon from '$lib/images/icons/ThreeVerticalDotsIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	import { investmentDetailsFooterEvents } from '../constants';
	import { orderpadParentPage } from '../../../../InvestmentPad/constants';
	import FooterErrorMessage from './FooterErrorMessage.svelte';

	const dispatch = createEventDispatcher();

	export let parentPage: string;
	export let investmentAllowed = false;
	export let redemptionAllowed = false;
	export let investmentDisableText = '';
	export let redemptionDisableText = '';
	export let isWithdrawDisableLockInCase = false;

	const handleButtonsClick = (eventType: string) => {
		if (eventType === investmentDetailsFooterEvents?.INVEST) {
			dispatch('investButtonClick');
		} else if (eventType === investmentDetailsFooterEvents?.WITHDRAW) {
			dispatch('withdrawButtonClick');
		} else if (eventType === investmentDetailsFooterEvents?.MORE_OPTIONS) {
			dispatch('moreOptionsButtonClick');
		}
	};
</script>

{#if true}
	<article class="fixed inset-0 top-auto z-20 block bg-white p-2 md:hidden">
		<section
			class={`flex items-center ${
				parentPage === orderpadParentPage?.INVESTMENT ? 'justify-around' : 'justify-between'
			}`}
		>
			{#if parentPage === orderpadParentPage?.INVESTMENT}
				<Button
					class={`w-32 rounded !bg-white ${
						redemptionDisableText?.length ? '!border-grey-line !text-grey-medium' : ''
					}`}
					disabled={!redemptionAllowed}
					variant="outlined"
					onClick={() => handleButtonsClick(investmentDetailsFooterEvents?.WITHDRAW)}
				>
					WITHDRAW
				</Button>
			{/if}

			<Button
				class={`${
					parentPage === orderpadParentPage?.INVESTMENT ? 'w-32' : 'w-full'
				} !disabled:text-grey-disabled rounded disabled:!bg-grey-line`}
				disabled={!investmentAllowed}
				onClick={() => handleButtonsClick(investmentDetailsFooterEvents?.INVEST)}
			>
				{parentPage === orderpadParentPage?.INVESTMENT ? 'INVEST MORE' : 'INVEST'}
			</Button>

			{#if parentPage === orderpadParentPage?.INVESTMENT}
				<Button
					class="rounded border-none !bg-grey px-6"
					variant="outlined"
					onClick={() => handleButtonsClick(investmentDetailsFooterEvents?.MORE_OPTIONS)}
				>
					<ThreeVerticalDotsIcon />
				</Button>
			{/if}
		</section>

		{#if investmentDisableText?.length}
			<!-- Investment Not Allowed Text Section -->
			<FooterErrorMessage errorMessage={investmentDisableText}>
				<svelte:fragment slot="icon">
					<span class="mr-1">
						<CautionIcon />
					</span>
				</svelte:fragment>
			</FooterErrorMessage>
		{/if}

		{#if parentPage === orderpadParentPage?.INVESTMENT && redemptionDisableText?.length}
			<!-- Redemption Not Allowed Text Section -->
			<FooterErrorMessage errorMessage={redemptionDisableText}>
				<svelte:fragment slot="icon">
					{#if isWithdrawDisableLockInCase}
						<span class="mr-1">
							<LockedIcon />
						</span>
					{:else}
						<span class="mr-1">
							<CautionIcon />
						</span>
					{/if}
				</svelte:fragment>
			</FooterErrorMessage>
		{/if}
	</article>
{/if}
