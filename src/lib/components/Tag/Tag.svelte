<script lang="ts">
	export let name = '';
</script>

{#if name}
	<span
		class="rounded-sm bg-background px-1 text-xs font-normal capitalize text-body {$$props.class}"
		>{name}</span
	>
{/if}
