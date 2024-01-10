<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { WMSIcon } from 'svelte-components';
	import Buyportfolio from '$lib/images/BuyPortfolio.svg';

	const goToBuyPortfolio = () => {
		goto(`${base}/buyPortfolio`);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={() => goToBuyPortfolio()}
	class="mt-2 flex items-center rounded-lg bg-purple-background px-4 py-3 shadow-sm"
>
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
		<p class="text-sm font-medium text-black-key">Maximise Portfolio Performance</p>
		<p class="pt-1 text-xs text-black-bolder">
			Invest in a ready-made portfolio based on your expected returns
		</p>
	</div>
	<WMSIcon name="right-arrow" width={30} height={25} stroke="#3F5BD9" />
</div>
