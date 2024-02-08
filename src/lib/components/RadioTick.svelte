<script lang="ts">
	import Tick from '$lib/images/icons/TickIcon.svelte';

	export let selected = false;
</script>

<div
	class={`flex h-4 w-4 items-center justify-center rounded-lg bg-border ${$$props.class || ''}`}
	class:!bg-buy={selected}
>
	{#if selected}
		<Tick />
	{/if}
</div>
