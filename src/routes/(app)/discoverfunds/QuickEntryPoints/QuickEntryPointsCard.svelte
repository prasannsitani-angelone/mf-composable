<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Link from '$components/Link.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	export let title = '';
	export let subtitle = '';
	export let to = '';
	export let liveNFO = 0;
	export let preloadData = 'hover';
	export let onLinkClicked: () => void = () => undefined;

	const dispatch = createEventDispatcher();

	onMount(() => {
		dispatch('entryCardMounted');
	});
</script>

<Link {to} {preloadData} on:linkClicked={onLinkClicked}>
	<div class="flex items-center justify-between bg-background-alt p-4 {$$props.class}">
		<div class="flex pr-4">
			<div class="flex justify-between">
				<slot name="icon" />
			</div>
			<div class="mt-2 px-3 text-sm font-medium text-title">
				<p>{title}</p>
				<p class="font-normal {$$props?.subtitleClass}">{subtitle}</p>
			</div>
		</div>
		<div class="flex items-center">
			{#if liveNFO}
				<div
					class="mr-1 h-4 w-12 items-center rounded-lg bg-sell text-center text-[10px] text-background-alt"
				>
					Live ({liveNFO})
				</div>
			{/if}
			<WMSIcon name="right-arrow" stroke="var(--PRIMARY)" />
		</div>
		<slot name="bottomLayer" />
	</div>
</Link>
