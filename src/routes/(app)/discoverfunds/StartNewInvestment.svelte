<script lang="ts">
	import Button from '$components/Button.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	const navigateToExploreFunds = () => {
		goto(`${base}/categories?id=19`);
	};
</script>

<aside
	class="flex flex-col items-center justify-center rounded-lg bg-background-alt p-3 pt-6 shadow-clg {$$props.class}"
>
	<img
		src={`${base}/images/StartNewMutualFund.webp`}
		width="208"
		height="156"
		alt="Start a new investment"
	/>
	<div class="mt-3 text-center text-base font-normal text-title">Start a new investment</div>
	<div class="mt-1 text-sm font-normal text-body">Invest in a New Fund</div>
	<Button
		class="mt-8 w-full rounded py-4 text-sm uppercase !text-[#F9FAFF]"
		onClick={navigateToExploreFunds}>Invest Now</Button
	>
</aside>
