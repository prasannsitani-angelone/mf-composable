<script lang="ts">
	import Banner from '$lib/components/Banner.svelte';
	import OpenNowCard from '$lib/components/GoldBonds/OpenNowCard.svelte';
	import BagIcon from '$lib/images/icons/BagIcon.svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import { onMount } from 'svelte';
	let liveSchemes: any[] = [];
	onMount(() => {
		useFetch('/schemes').then((schemes: any) => {
			liveSchemes = schemes?.schemesDetail.filter((scheme: any) => {
				return !scheme.live && scheme;
			});
		});
	});
</script>

{#if liveSchemes.length > 0}
	<Banner />
	<div class="mt-2 flex items-center">
		<BagIcon />
		<span class="ml-2 text-sm text-grey-body">Open now</span>
	</div>
	{#each liveSchemes as scheme (scheme.id)}
		<OpenNowCard {scheme} />
	{/each}
{:else}
	<Banner
		imageUrl="/images/nolivesgb.webp"
		title="No Live SGB"
		description="No Open SGB right now. But still can invest in traded SGB below or tap to know more."
	/>
{/if}
