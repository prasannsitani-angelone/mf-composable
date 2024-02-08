<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { RadioButton } from 'svelte-components';

	export let selectedInvestmentType: string;

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
		class="flex items-center md:cursor-pointer"
		on:click={() => handleInvestmentTypeChange('SIP')}
	>
		<RadioButton
			class="scale-125 !bg-background-alt {selectedInvestmentType !== 'SIP'
				? 'border-[1.5px] !border-body'
				: ''}"
			selected={selectedInvestmentType === 'SIP'}
		/>
		<div class="ml-2.5 {selectedInvestmentType === 'SIP' ? 'font-medium' : ''}">
			<slot name="sipLabel">SIP</slot>
		</div>
	</article>

	<article
		class="ml-6 flex items-center md:cursor-pointer"
		on:click={() => handleInvestmentTypeChange('OneTime')}
	>
		<RadioButton
			class="scale-125 !bg-background-alt {selectedInvestmentType !== 'OneTime'
				? 'border-[1.5px] !border-body'
				: ''}"
			selected={selectedInvestmentType === 'OneTime'}
		/>
		<div class="ml-2.5 {selectedInvestmentType === 'OneTime' ? 'font-medium' : ''}">
			<slot name="oneTimeLabel">One Time</slot>
		</div>
	</article>
</section>
