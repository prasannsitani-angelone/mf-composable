<script>
	import { BtnSize, PortfolioCard } from 'svelte-components';
	import Button from '$components/Button.svelte';
	import OptimisePorfolioBg from '$lib/images/OptimisePortfolioBackground.svg';
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click on:keydown>
	<PortfolioCard class="!px-0 !pb-0 !pt-0 {$$props.class}" variant="success">
		<section class="flex items-center justify-between lg:mx-0">
			<article class="flex w-7/12 flex-col items-start py-3 pl-4">
				<div class="text-base font-medium md:text-sm">Optimise Your Portfolio</div>
				<div class="mt-1 text-xs font-normal">
					Take your portfolio to the next level by investing in this fund
				</div>
				<Button size={BtnSize.SM} class="mt-3 !bg-white !text-1xs !text-green-amount" on:click
					>GET STARTED</Button
				>
			</article>

			<article class="flex w-5/12 flex-col items-end">
				<img src={OptimisePorfolioBg} alt="Optimise Background" class="h-full w-full" />
			</article>
		</section>
	</PortfolioCard>
</div>
