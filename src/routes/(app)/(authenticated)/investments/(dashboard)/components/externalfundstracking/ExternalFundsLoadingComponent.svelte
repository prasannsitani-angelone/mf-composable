<script>
	import InvestmentDashboardLoader from '../../Loaders/InvestmentDashboardLoader.svelte';
	import PortfolioCardLoader from '$components/PortfolioCards/PortfolioCardLoader.svelte';
</script>

<section class="col-span-1 row-start-3 sm:col-span-1 sm:col-start-1">
	<InvestmentDashboardLoader />
</section>
<section class="col-span-1 row-start-1 sm:col-span-1 sm:col-start-2 sm:row-span-3">
	<PortfolioCardLoader />
</section>
