<script lang="ts">
	import { SEO } from 'svelte-components';
	import SwpConfirmation from './components/SwpConfirmation.svelte';
	import type { PageData } from './$types';
	import SwpLoader from './components/SwpLoader.svelte';

	export let data: PageData;
</script>

<SEO
	seoTitle={`${data?.orderDetails?.schemeName} - Switch Funds | Angel One`}
	seoDescription={`${data?.orderDetails?.schemeName} - Switch Funds | Angel One`}
/>
{#await data.api.allResponse}
	<section class="mt-6 flex justify-center">
		<SwpLoader />
	</section>
{:then res}
	{#if res?.holdingsData && Object.keys(res.holdingsData)?.length > 0}
		<section class="mt-6 flex justify-center">
			<SwpConfirmation
				schemeData={res.schemeData}
				holdingDetails={res.holdingsData}
				params={data?.decodedParams}
			/>
		</section>
	{/if}
{/await}
