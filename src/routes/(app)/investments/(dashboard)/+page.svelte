<script lang="ts">
	import DeviceDetector from 'svelte-device-detector';
	import YourInvestments from './YourInvestments.svelte';
	import ReportsSection from './ReportsSection.svelte';
	import NoOrders from '$components/NoOrders.svelte';
	import PortfolioCard from '$components/PortfolioCards/PortfolioCard.svelte';
	import InvestmentOrders from './InvestmentOrders.svelte';

	import TrendingFunds from '../../discoverfunds/TrendingFunds/TrendingFunds.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section>
	{#await data.api.investment}
		Loading...............................!!
	{:then response}
		{#if response && response.status === 'success' && Array.isArray(response.data.holdings) && response.data.holdings.length > 0}
			<!-- Show Users investment if exist -->
			<YourInvestments tableData={response.data?.holdings || []} />
			<DeviceDetector showInDevice={['mobile']}>
				<ReportsSection />
			</DeviceDetector>
		{:else}
			<!-- Show No orders component and TendingFunds Table in case user investment does not exist or not processed -->
			<article
				class="mt-2 hidden max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-0 md:block"
			>
				<NoOrders
					title="Your investments will show up here. Explore funds and place an order to get started"
				/>
			</article>
			{#await data.api.homePage}
				<div class="Loading">...Loading</div>
			{:then schemeData}
				{#if schemeData?.weeklyTopSchemes}
					<TrendingFunds tableData={schemeData?.weeklyTopSchemes} />
				{/if}
			{:catch error}
				<p style="color: red">Error Ocurred!!!!</p>
			{/await}
		{/if}
	{:catch error}
		<div>Got An error!!!</div>
	{/await}
</section>

<!-- Right Side Contents -->
<section>
	<!-- Portfolio cards: All scenarios -->
	<article>
		<PortfolioCard />
	</article>
	<!-- Order cards: Visible only in desktop and tablet -->
	<DeviceDetector showInDevice={['desktop', 'tablet']}>
		<article class="mt-5">
			<InvestmentOrders />
		</article>
	</DeviceDetector>
</section>
