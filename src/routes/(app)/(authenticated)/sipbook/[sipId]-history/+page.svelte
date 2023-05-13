<script lang="ts">
	import InvalidUrl from '$components/Error/InvalidUrl.svelte';
	import SipHistory from '../SipDetails/SipHistory.svelte';
	import type { PageData } from './$types';
	import SipHistoryLoader from './SipHistoryLoader.svelte';

	export let data: PageData;
</script>

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
