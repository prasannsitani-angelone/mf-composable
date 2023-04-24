<script lang="ts">
	import { page as appPage } from '$app/stores';
	import { appStore } from '$lib/stores/SparkStore';
	import type { LayoutData } from './$types';
	import { tokenStore } from '$lib/stores/TokenStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getContext, onMount, setContext } from 'svelte';
	import type { AppContext } from '$lib/types/IAppContext';
	import Default from '$lib/layouts/Default.svelte';
	import TwoColumn from '$lib/layouts/TwoColumn.svelte';
	import TwoColumnReverse from '$lib/layouts/TwoColumnReverse.svelte';
	import TwoColumnRightLarge from '$lib/layouts/TwoColumnRightLarge.svelte';
	import FullHeightWithoutPadding from '$lib/layouts/FullHeightWithoutPadding.svelte';

	export let data: LayoutData;
	// Update store with Spark headers
	const { sparkHeaders, tokenObj, profile } = data;
	// Update store with Spark headers
	onMount(() => {
		tokenStore.updateStore({ ...tokenObj });
		appStore.updateStore({ ...sparkHeaders });
		profileStore.updateStore({ ...profile });
	});

	const appContext: AppContext = getContext('app');
</script>

{#if $appPage.data?.layoutConfig?.layoutType === 'TWO_COLUMN'}
	<TwoColumn>
		<slot />
	</TwoColumn>
{:else if $appPage.data?.layoutConfig?.layoutType === 'TWO_COLUMN_REVERSE'}
	<TwoColumnReverse>
		<slot />
	</TwoColumnReverse>
{:else if $appPage.data?.layoutConfig?.layoutType === 'TWO_COLUMN_RIGHT_LARGE'}
	<TwoColumnRightLarge>
		<slot />
	</TwoColumnRightLarge>
{:else if $appPage.data?.layoutConfig?.layoutType === 'FULL_HEIGHT_WITHOUT_PADDING'}
	<FullHeightWithoutPadding>
		<slot />
	</FullHeightWithoutPadding>
{:else}
	<Default>
		<slot />
	</Default>
{/if}
