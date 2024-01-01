<script lang="ts">
	import SipDashboard from './SipDashboard.svelte';
	import SipDashboardLoader from './SipDashboardLoader.svelte';
	import type { PageData } from './$types';
	import { SEO } from 'svelte-components';
	import { onMount } from 'svelte';
	import SomethingWentWrong from '$components/Error/SomethingWentWrong.svelte';
	export let data: PageData;

	const scrollToTop = () => {
		document?.getElementsByTagName?.('main')?.[0]?.scrollTo(0, 0);
	};

	onMount(() => {
		scrollToTop();
	});
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
			{#if sipBookData instanceof Error}
				<SomethingWentWrong />
			{:else}
				<SipDashboard {sipBookData} {data} />
			{/if}
		{/await}
	</section>
</article>
