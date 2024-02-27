<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import TaxOption from './TaxOption.svelte';

	let taxType: 'LTCG' | 'STCG';
	let taxLimit = 0;
	let categoryName = '';

	interface ITaxOptionDataTypes {
		type: 'LTCG' | 'STCG';
		title: string;
		description: string;
	}

	let taxOptionData: ITaxOptionDataTypes;

	const taxOptionsDataLtcg: ITaxOptionDataTypes = {
		type: 'LTCG',
		title: `Withdrawing up to ₹${taxLimit?.toFixed(2)}`,
		description:
			categoryName?.toLowerCase() === 'equity'
				? '<div>Only <span class="text-title font-medium">LTCG</span> (Long Term Capital Gains) tax applicable <span class="text-title font-medium">at 10%</span></div>'
				: '<div>Only <span class="text-title font-medium">LTCG</span> (Long Term Capital Gains) tax applicable <span class="text-title font-medium">at 20%</span></div>'
	};

	const taxOptionsDataStcg: ITaxOptionDataTypes = {
		type: 'STCG',
		title: `Withdrawing more than ₹${taxLimit?.toFixed(2)}`,
		description:
			categoryName?.toLowerCase() === 'equity'
				? '<div><span class="text-title font-medium">STCG</span> (Short Term Capital Gains) tax applicable <span class="text-title font-medium">at 15%</span> in addition to <span class="text-title font-medium">10% LTCG</span> tax</div>'
				: '<div><span class="text-title font-medium">STCG</span> (Short Term Capital Gains) tax applicable <span class="text-title font-medium">as per your tax slab rate</span> in addition to <span class="text-title font-medium">20% LTCG</span> tax</div>'
	};

	const setTaxationData = () => {
		if (taxType === 'LTCG') {
			taxOptionData = taxOptionsDataLtcg;
		} else if (taxType === 'STCG') {
			taxOptionData = taxOptionsDataStcg;
		}
	};

	setTaxationData();

	export { taxType, taxLimit, categoryName };
</script>

<article
	class="flex w-full flex-col rounded-b-none rounded-t-2xl bg-background-alt px-3 pb-4 pt-8 text-title shadow-clg md:rounded-lg {$$props?.class}"
>
	<div class="text-lg font-medium text-title">Taxes on Withdrawal</div>

	<section class="my-4 rounded-lg border p-3 pb-0">
		<TaxOption title={taxOptionData?.title} description={taxOptionData?.description}>
			<svelte:fragment slot="tag">
				{#if taxOptionData?.type === 'LTCG'}
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
	</section>

	<div class="m px-3 text-[11px] font-normal text-body">
		Note: Taxes are applicable if your realised gain exceeds ₹1 Lakh across brokers. Calculations
		are based on transactions done with Angel One only. Your actual capital gains tax may differ
	</div>
</article>
