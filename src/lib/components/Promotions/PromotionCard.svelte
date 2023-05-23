<script lang="ts">
	import Link from '$components/Link.svelte';
	import { getPromotionsNavigationPath } from '$lib/utils';
	import type { PromotionsEntity } from '$lib/types/IDiscoverFunds';
	export let amcData: PromotionsEntity;
	export let imageClass = '';
</script>

<Link to={getPromotionsNavigationPath(amcData)} class="block  overflow-hidden {$$props.class || ''}"
	><img
		src={amcData.uri || ''}
		class="inline-block {imageClass}"
		loading="lazy"
		alt="Promotion card for {amcData.name}"
	/></Link
>
