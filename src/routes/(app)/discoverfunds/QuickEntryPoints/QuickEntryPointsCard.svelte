<script lang="ts">
	import Link from '$components/Link.svelte';

	export let title = '';
	export let to = '';
	export let comingSoon = false;
	export let preloadData = 'hover';
	export let onLinkClicked: () => void = () => undefined;
</script>

<Link {to} {preloadData} disableRedirect={comingSoon} on:linkClicked={onLinkClicked}>
	<div class="flex flex-col rounded-lg bg-white pt-2">
		<div class="pl-4 pr-2">
			<div class="flex flex-row justify-between">
				<slot name="icon" />
				{#if comingSoon}
					<div
						class="flex h-fit items-center justify-center rounded-[32px] bg-red-errorDark px-4 py-0.5 text-center text-[10px] font-medium text-white"
					>
						Coming Soon
					</div>
				{/if}
			</div>
			<div class="mt-2 text-sm font-medium text-black-key">
				{title}
			</div>
		</div>
		<slot name="bottomLayer" />
	</div>
</Link>
