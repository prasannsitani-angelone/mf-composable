<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { RadioButton } from 'svelte-components';

	export let selectedInvestmentType: string;
	export let firstRadioClass = '';
	export let secondRadioClass = '';

	const dispatch = createEventDispatcher();

	const handleInvestmentTypeChange = (val: string) => {
		if (val !== selectedInvestmentType) {
			dispatch('investmentTypeChange', val);
		}
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<section class="flex items-center text-xs font-normal text-title {$$props.class}">
	<article
		class="flex items-center md:cursor-pointer {firstRadioClass}"
		on:click={() => handleInvestmentTypeChange('SIP')}
	>
		<RadioButton
			class="scale-125 !bg-background-alt {selectedInvestmentType !== 'SIP'
				? 'border-[1.5px] !border-body'
				: ''}"
			selected={selectedInvestmentType === 'SIP'}
		/>
		<div class="ml-2.5">
			<slot name="sipLabel">Invest Monthly (SIP)</slot>
		</div>
	</article>

	<article
		class="ml-6 flex items-center md:cursor-pointer {secondRadioClass}"
		on:click={() => handleInvestmentTypeChange('OneTime')}
	>
		<RadioButton
			class="scale-125 !bg-background-alt {selectedInvestmentType !== 'OneTime'
				? 'border-[1.5px] !border-body'
				: ''}"
			selected={selectedInvestmentType === 'OneTime'}
		/>
		<div class="ml-2.5">
			<slot name="oneTimeLabel">Invest One Time</slot>
		</div>
	</article>
</section>
