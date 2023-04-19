<script lang="ts">
	import SipDashboard from './SipDashboard.svelte';
	import type { PageData } from './$types';
	import SipDashboardLoader from '$components/Loaders/SipDashboardLoader.svelte';
	export let data: PageData;
</script>

<article>
	<section class="mt-0 pb-8">
		{#await data?.api?.getSipBookData}
			<SipDashboardLoader />
		{:then sipBookData}
			<SipDashboard {sipBookData} {data} />
		{/await}
	</section>
</article>
