<script lang="ts">
	import SipDashboard from './SipDashboard.svelte';
	import type { PageData } from './$types';
	import SipDashboardLoader from './SipDashboardLoader.svelte';
	import { SEO } from 'wms-ui-component';
	export let data: PageData;
</script>

<article>
	<SEO
		seoTitle="Your Mutual Funds SIPs | Angel One"
		seoDescription="Get Access to your Mutual Funds sips here."
	/>
	<section class="mt-0 pb-8">
		{#await data?.api?.getSipBookData}
			<SipDashboardLoader />
		{:then sipBookData}
			<SipDashboard {sipBookData} {data} />
		{/await}
	</section>
</article>
