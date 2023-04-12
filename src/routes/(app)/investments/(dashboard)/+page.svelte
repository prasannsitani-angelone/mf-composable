<script lang="ts">
	import DeviceDetector from 'svelte-device-detector';
	import YourInvestments from './YourInvestments.svelte';
	import ReportsSection from './ReportsSection.svelte';
	import NoOrders from '$components/NoOrders.svelte';
	import PortfolioCard from '$components/PortfolioCards/PortfolioCard.svelte';
	import InvestmentOrders from './InvestmentOrders.svelte';
	import Link from '$components/Link.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';

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
		{:else}
			<!-- Show No orders component and TendingFunds Table in case user investment does not exist or not processed -->
			<article
				class="mt-2 hidden max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-0 md:block"
			>
				<NoOrders
					title="Your investments will show up here. Explore funds and place an order to get started"
				/>
			</article>
			{#if data?.schemeData?.weeklyTopSchemes}
				<TrendingFunds
					tableData={data.schemeData.weeklyTopSchemes}
					title="Popular Funds"
					classes={{ container: '!pb-0 mb-4', header: 'max-sm:pb-0' }}
				>
					<svelte:fragment slot="footer">
						<footer class="mt-3 border-t border-grey-line py-5">
							<div
								class=" flex cursor-pointer items-center justify-center text-sm font-semibold uppercase text-blue-primary"
							>
								<Link
									to={`/explorefunds/${data.schemeData.searchOptions[0]?.name
										?.split(' ')
										.join('-')
										.toLowerCase()}?id=${data.schemeData.searchOptions[0]?.id || ''}`}
									class="flex items-center"
								>
									<span class="uppercase">explore funds</span>
									<RightIcon class="ml-2" stroke="#3F5BD9" />
								</Link>
							</div>
						</footer>
					</svelte:fragment>
				</TrendingFunds>
			{/if}
		{/if}
	{:catch error}
		<div>Got An error!!!</div>
	{/await}
	<DeviceDetector showInDevice={['mobile']}>
		<ReportsSection />
	</DeviceDetector>
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
