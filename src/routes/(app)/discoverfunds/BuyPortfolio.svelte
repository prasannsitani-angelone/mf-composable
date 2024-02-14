<script>
	import { base } from '$app/paths';
	import { buildPortfolioCardClicked } from '$lib/analytics/buyPortfolio/buyPortfolio';
	import Button from '$components/Button.svelte';
	import { modifiedGoto } from '$lib/utils/goto';
	import BuyPortfolioBg from '$components/BuyPortfolioBg.svelte';
	import { page } from '$app/stores';

	const goToBuyPortfolio = () => {
		buildPortfolioCardClicked();
		modifiedGoto(`${base}/buyPortfolio`);
	};

	$: deviceType = $page.data.deviceType;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="light relative flex items-center rounded-lg hover:cursor-pointer {deviceType.isMobile
		? 'min-h-[120px]'
		: ''} {$$props.class}"
	on:click={goToBuyPortfolio}
>
	<div class="z-2 absolute h-full w-full"><BuyPortfolioBg class="absolute h-full w-full" /></div>
	<div class="z-0 flex items-center p-4">
		<div class="flex flex-col">
			<p class="text-sm font-medium text-title">Invest in a Ready Made Portfolio</p>
			<p class="py-1 pr-28 text-xs text-body">
				Select a portfolio based on expected returns and maximise performance
			</p>
			<Button size="xs" class="mr-4 mt-1 w-fit px-2 text-xs">EXPLORE NOW</Button>
		</div>
	</div>
</div>
