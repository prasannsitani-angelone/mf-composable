<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { WMSIcon } from 'svelte-components';

	const dispatch = createEventDispatcher();

	let taxLimit = 0;
	let categoryName = '';

	const handleInfoIconClick = () => {
		dispatch('infoClick');
	};

	const getCategoryBasedHtmlText = () => {
		if (categoryName?.toLowerCase() !== 'equity') {
			return `<div><div style="font-weight: 500;">Higher taxes may apply (STCG tax at 15%)</div><div>Withdraw less than ₹${taxLimit?.toFixed(
				2
			)} to optimise taxes</div></div>`;
		} else {
			return `<div><div style="font-weight: 500;">Higher taxes may apply (STCG tax as per your tax slab)</div><div>Withdraw less than ₹${taxLimit?.toFixed(
				2
			)} to optimise taxes</div></div>`;
		}
	};

	export { taxLimit, categoryName };
</script>

<section
	class="flex items-center justify-between rounded bg-yellow-background px-3 py-2 {$$props?.class}"
>
	<div class="text-xs text-body">{@html getCategoryBasedHtmlText()}</div>
	<WMSIcon
		name="info-in-circle-dark"
		height={16}
		width={16}
		class="ml-1 md:cursor-pointer"
		on:click={handleInfoIconClick}
	/>
</section>
