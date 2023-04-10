<script type="ts">
	import Button from '$components/Button.svelte';
	import { base } from '$app/paths';
</script>

<aside
	class="sticky -top-14 flex flex-col items-center justify-center rounded-lg bg-white p-3 pt-6 shadow-clg"
>
	<img
		src={`${base}/images/StartNewMutualFund.webp`}
		width="208"
		height="156"
		alt="Start a new investment"
	/>
	<div class="mt-3 text-center text-base font-medium text-black-title">Start a new investment</div>
	<div class="mt-1 text-sm font-normal text-grey-body">Invest in a New Fund</div>
	<Button class="mt-8 w-full rounded py-4 text-sm uppercase !text-[#F9FAFF]">Invest Now</Button>
</aside>
