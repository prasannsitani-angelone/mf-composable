<script lang="ts">
	import InvalidUrl from '$components/Error/InvalidUrl.svelte';
	import { SEO } from 'svelte-components';
	import SipHistory from '../SipDetails/SipHistory.svelte';
	import type { PageData } from './$types';
	import SipHistoryLoader from './SipHistoryLoader.svelte';
	import PageTitle from '$components/PageTitle.svelte';

	export let data: PageData;
</script>

<SEO
	seoTitle="SIP History Details | Angel One"
	seoDescription="Get your sip history details with one click"
/>
<header class="hidden sm:block">
	<PageTitle title="SIP History Details" class="mb-4 flex" />
</header>
{#await data?.api?.getSipData}
	<SipHistoryLoader />
{:then sipData}
	{#if sipData}
		<section class="m-2">
			<!-- SIP history -->
			<SipHistory
				sipId={sipData?.sipId}
				sipOrderHistory={sipData?.sipOrderHistory}
				sipCreatedTs={sipData?.createdTs}
				disableCollapse={true}
				hideFooter={true}
				fullPageList={true}
			>
				<svelte:fragment slot="headerTitle">
					<span />
				</svelte:fragment>
			</SipHistory>
		</section>
	{:else}
		<InvalidUrl />
	{/if}
{:catch}
	<InvalidUrl />
{/await}
