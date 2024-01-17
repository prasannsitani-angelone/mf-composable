<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { WMSIcon } from 'svelte-components';
	import Buyportfolio from '$lib/images/BuyPortfolio.svg';
	import { buildPortfolioCardClicked } from '$lib/analytics/buyPortfolio/buyPortfolio';

	const goToBuyPortfolio = () => {
		goto(`${base}/buyPortfolio`);
		buildPortfolioCardClicked();
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={() => goToBuyPortfolio()}
	class="mt-2 flex items-center justify-between rounded-lg bg-purple-background px-4 py-3 shadow-sm {$$props.class}"
>
	<div class="flex items-center">
		<div class="mr-3">
			<img
				height="88"
				width="105"
				src={Buyportfolio}
				loading="lazy"
				alt="Illustration showing portfolio icon"
			/>
		</div>
		<div class="flex flex-col">
			<p class="text-sm font-medium text-black-key">Invest in a Ready Made Portfolio</p>
			<p class="pt-1 text-xs text-black-bolder">
				Select a portfolio based on expected returns and maximise performance
			</p>
		</div>
	</div>
	<WMSIcon name="right-arrow" width={30} height={25} stroke="#3F5BD9" />
</div>
