<script lang="ts">
	import Link from '$components/Link.svelte';
	import { getPromotionsNavigationPath } from '$lib/utils';
	import type { PromotionsEntity } from '$lib/types/IDiscoverFunds';
	import { onMount } from 'svelte';
	import {
		promotionsCardClickEvent,
		promotionsCardImpressionEvent
	} from '$components/Promotions/analytics';

	export let amcData: PromotionsEntity;
	export let imageClass = '';

	onMount(() => {
		promotionsCardImpressionEvent();
	});
</script>

<Link
	to={getPromotionsNavigationPath(amcData)}
	on:linkClicked={() => promotionsCardClickEvent()}
	class="block overflow-hidden shadow-csm {$$props.class || ''}"
>
	<img
		src={amcData.uri || ''}
		class="inline-block {imageClass}"
		loading="lazy"
		alt="Promotion card for {amcData.name}"
	/>
</Link>
