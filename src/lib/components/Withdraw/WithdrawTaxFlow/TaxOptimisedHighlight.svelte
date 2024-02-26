<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { WMSIcon } from 'svelte-components';

	const dispatch = createEventDispatcher();

	let taxLimit = 0;

	const handleInfoIconClick = () => {
		dispatch('infoClick');
	};

	export { taxLimit };
</script>

<section class="flex items-center justify-between rounded bg-green px-3 py-2 {$$props?.class}">
	<article class="flex items-center">
		<WMSIcon
			name="tick-in-circle-extended"
			height={12}
			width={12}
			stroke="#fff"
			bgStroke="var(--BUY)"
			class="min-w-[12px]"
		/>
		<div class="ml-1 text-xs font-normal text-buy">Tax optimised</div>
	</article>

	<article class="flex items-center">
		<div class="text-xs font-medium text-body">up to ₹{taxLimit?.toFixed(2)}</div>
		<WMSIcon
			name="info-in-circle-dark"
			height={16}
			width={16}
			class="ml-1 md:cursor-pointer"
			on:click={handleInfoIconClick}
		/>
	</article>
</section>
