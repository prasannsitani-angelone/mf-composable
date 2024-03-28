<script lang="ts">
	import { page } from '$app/stores';
	import { headerStore } from '$lib/stores/HeaderStore';
	import { onDestroy, onMount } from 'svelte';
	import { SEO } from 'svelte-components';
	import type { PageData } from './$types';
	import SwpConfirmation from './components/SwpConfirmation.svelte';
	import SwpLoader from './components/SwpLoader.svelte';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { appStore } from '$lib/stores/SparkStore';
	import { goBackToSpark } from '$lib/utils';

	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	const handleBackNavigation = () => {
		if ($appStore.openViaTabView || appStore.isMFTabAvailable()) {
			goBackToSpark();
		} else {
			goto(`${base}/discoverfunds`);
		}
	};

	onMount(() => {
		if (isMobile || isTablet) {
			$headerStore.showMobileHeader = false;
		}
	});

	onDestroy(() => {
		if (isMobile || isTablet) {
			$headerStore.showMobileHeader = true;
		}
	});
</script>

<MobileHeader
	title={'Confirm SWP'}
	showSearchIcon={false}
	showBackIcon={true}
	showCloseIcon={false}
	class="fixed left-0 right-0 top-0 bg-background-alt"
	on:backButtonClick={handleBackNavigation}
/>
{#await data.api.allResponse}
	<section class="mt-16 flex justify-center md:mt-4">
		<SwpLoader />
	</section>
{:then res}
	<SEO
		seoTitle={`${res?.schemeData?.schemeName} - SWP | Angel One`}
		seoDescription={`${res?.schemeData?.schemeName} - SWP | Angel One`}
	/>
	{#if res?.holdingsData && Object.keys(res.holdingsData)?.length > 0}
		<section class="mx-0 mt-16 w-screen px-0 md:mt-4 md:flex md:w-full md:justify-center">
			<SwpConfirmation
				schemeData={res.schemeData}
				holdingDetails={res.holdingsData}
				params={data?.decodedParams}
			/>
		</section>
	{/if}
{/await}
