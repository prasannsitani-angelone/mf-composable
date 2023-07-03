<script lang="ts">
	import type { SvelteComponent, SvelteComponentTyped } from 'svelte/internal';

	export let when = false;
	export let component: () => SvelteComponent;
	let loading: Promise<{ default: SvelteComponentTyped }>;
	$: if (when) {
		load();
	}
	function load() {
		loading = component();
	}
</script>

{#if when}
	{#await loading then { default: Component }}
		<Component {...$$props} />
	{/await}
{/if}
