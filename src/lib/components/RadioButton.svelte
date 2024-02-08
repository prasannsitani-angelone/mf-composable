<script lang="ts">
	export let selected = false;
	export let clazz = '';
</script>

<div
	class={`flex h-4 w-4 items-center justify-center rounded-full bg-border ${
		selected ? 'border-[1.5px] border-primary' : ''
	} ${clazz}`}
>
	{#if selected}
		<div class="h-2 w-2 rounded-full bg-primary" />
	{/if}
</div>
