<script lang="ts">
	import Tick from '$lib/images/icons/TickIcon.svelte';

	export let selected = false;
</script>

<div
	class={`flex h-4 w-4 items-center justify-center rounded-lg bg-grey-line ${$$props.class || ''}`}
	class:!bg-green-buy={selected}
>
	{#if selected}
		<Tick />
	{/if}
</div>
