<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	let clazz = 'bg-red-tint';
	let icon: typeof SvelteComponent | null = null;
	let message: string;
	export { icon, message, clazz as class };
</script>

<div class={`mt-3 flex items-center justify-center py-2 ${clazz}`}>
	{#if icon}
		<svelte:component this={icon} />
	{/if}
	<span class="ml-2 text-xs text-black-title">{message}</span>
</div>
