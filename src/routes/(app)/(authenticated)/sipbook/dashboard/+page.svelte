<script lang="ts">
	import SipDashboard from './SipDashboard.svelte';
	import SipDashboardLoader from './SipDashboardLoader.svelte';
	import type { PageData } from './$types';
	import { SEO } from 'svelte-components';
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
