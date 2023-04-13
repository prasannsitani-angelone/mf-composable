<script lang="ts">
	import TabSelection from '../TabSelection/TabSelection.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import SipDashboard from './SipDashboard.svelte';
	import type { PageData } from './$types';
	import SipDashboardLoader from '$components/Loaders/SipDashboardLoader.svelte';

	const handleTabSelection = () => {
		goto(`${base}/orders/orderspage`, { replaceState: true });
	};
	export let data: PageData;
</script>

<article>
	<TabSelection activeTab="SIPBOOK" {handleTabSelection} />
	<section class="mt-0 pt-12 pb-8">
		{#await data?.api?.getSipBookData}
			<SipDashboardLoader />
		{:then sipBookData}
			<SipDashboard {sipBookData} {data} />
		{/await}
	</section>
</article>
