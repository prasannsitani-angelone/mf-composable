<script>
	import { base } from '$app/paths';
	import { buildPortfolioCardClicked } from '$lib/analytics/buyPortfolio/buyPortfolio';
	import Button from '$components/Button.svelte';
	import { modifiedGoto } from '$lib/utils/goto';

	const goToBuyPortfolio = () => {
		modifiedGoto(`${base}/buyPortfolio`);
		buildPortfolioCardClicked();
	};
</script>

<div class="bg-image mt-2 flex items-center rounded-lg {$$props.class}">
	<div class="flex items-center p-4">
		<div class="flex flex-col">
			<p class="text-sm font-medium text-black-key">Invest in a Ready Made Portfolio</p>
			<p class="py-1 pr-28 text-xs text-black-key">
				Select a portfolio based on expected returns and maximise performance
			</p>
			<Button size="sm" onClick={goToBuyPortfolio} class="mr-4 mt-1 w-fit px-6 text-xs">
				EXPLORE NOW
			</Button>
		</div>
	</div>
</div>

<style>
	.bg-image {
		background-image: url('../../../lib/images/BuyPortfolio.svg');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
</style>
