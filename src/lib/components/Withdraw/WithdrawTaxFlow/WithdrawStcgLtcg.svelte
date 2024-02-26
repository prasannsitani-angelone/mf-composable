<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { BtnVariant, Button, WMSIcon } from 'svelte-components';
	import TaxOption from './TaxOption.svelte';
	import type { IHoldingTaxationDetails } from '$lib/types/IInvestments';

	const dispatch = createEventDispatcher();

	let taxationDetails: IHoldingTaxationDetails;
	let categoryName = '';

	const taxOptionsData = [
		{
			type: 'LTCG',
			title: `Withdraw up to ₹${taxationDetails?.ltcgCurAmount?.toFixed(2)}`,
			description:
				categoryName?.toLowerCase() === 'equity'
					? '<div>Only <span style="font-weight: 500;">LTCG</span> (Long Term Capital Gains) tax applicable <span style="font-weight: 500;">at 10%</span></div>'
					: '<div>Only <span style="font-weight: 500;">LTCG</span> (Long Term Capital Gains) tax applicable <span style="font-weight: 500;">at 20%</span></div>'
		},
		{
			type: 'STCG',
			title: `Withdraw more than ₹${taxationDetails?.ltcgCurAmount?.toFixed(2)}`,
			description:
				categoryName?.toLowerCase() === 'equity'
					? '<div><span style="font-weight: 500;">STCG</span> (Short Term Capital Gains) tax applicable <span style="font-weight: 500;">at 15%</span> in addition to <span style="font-weight: 500;">10% LTCG</span> tax</div>'
					: '<div><span style="font-weight: 500;">STCG</span> (Short Term Capital Gains) tax applicable <span style="font-weight: 500;">as per your tax slab rate</span> in addition to <span style="font-weight: 500;">20% LTCG</span> tax</div>'
		}
	];

	const primaryCtaClick = () => {
		dispatch('continueCtaClick');
	};

	export { taxationDetails, categoryName };
</script>

<article
	class="flex w-full flex-col rounded-b-none rounded-t-2xl bg-background-alt px-3 pb-4 pt-8 text-title shadow-clg md:rounded-lg {$$props?.class}"
>
	<div class="text-lg font-medium text-title">Taxes on Withdrawal</div>

	<section class="my-4 rounded-lg border p-3 pb-0">
		{#each taxOptionsData as option, index}
			<TaxOption
				title={option?.title}
				description={option?.description}
				class={index > 0 ? 'border-t pt-1' : ''}
			>
				<svelte:fragment slot="tag">
					{#if option?.type === 'LTCG'}
						<section class="flex w-28 items-center rounded bg-green px-2 py-1">
							<WMSIcon
								name="tick-in-circle-extended"
								height={12}
								width={12}
								stroke="#fff"
								bgStroke="var(--BUY)"
								class="min-w-[12px]"
							/>
							<div class="ml-1 text-xs font-normal text-buy">Tax optimised</div>
						</section>
					{:else}
						<span />
					{/if}
				</svelte:fragment>
			</TaxOption>
		{/each}
	</section>

	<div class="mb-4 px-3 text-[11px] font-normal text-body">
		Note: Taxes are applicable if your realised gain exceeds ₹1 Lakh across brokers. Calculations
		are based on transactions done with Angel One only. Your actual capital gains tax may differ
	</div>

	<Button variant={BtnVariant?.Contained} class="mb-2" onClick={primaryCtaClick}>CONTINUE</Button>
</article>
