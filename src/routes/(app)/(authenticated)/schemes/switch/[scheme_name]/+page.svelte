<script lang="ts">
	import type { PageData } from '../$types';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import ErrorPage from '$components/ErrorPage.svelte';
	import SwitchSkeletonLoader from './SwitchSkeletonLoader.svelte';
	import SwitchHomePage from './SwitchHomePage/SwitchHomePage.svelte';

	export let data: PageData;
</script>

{#await data.api.folioHolding}
	<SwitchSkeletonLoader />
{:then folioHolding}
	{#await data.api.switchInSchemeData}
		<SwitchSkeletonLoader />
	{:then switchInSchemeData}
		<SwitchHomePage {folioHolding} {switchInSchemeData} />
	{/await}
{:catch}
	<ErrorPage
		heading="Fund Not Available"
		contentLine="Please explore other mutual funds on Angel one to continue investing"
		redirectUrl="/categories?id=101"
		textForButton="EXPLORE MUTUAL FUNDS"
	>
		<div slot="icon">
			<WMSIcon name="fund-details-error" width={173} height={160} />
		</div>
	</ErrorPage>
{/await}
