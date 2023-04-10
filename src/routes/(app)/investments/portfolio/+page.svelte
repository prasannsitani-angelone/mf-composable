<script lang="ts">
	import ErrorView from '$components/ErrorView.svelte';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import HoldingsOverview from './HoldingsOverview.svelte';
	import PageTitle from '$components/PageTitle.svelte';

	const handleErrorNavigation = () => '';
</script>

<section>
	<PageTitle title="Portfolio Analysis" />
	<ErrorView
		Icon={PortfolioEmptyIcon}
		heading="Your Portfolio is Empty"
		contentLine="Explore mutual funds to start building your portfolio"
		textForButton="EXPLORE MUTUAL FUNDS"
		handleCTAClick={handleErrorNavigation}
	/>
</section>
<section>
	<HoldingsOverview />
</section>
