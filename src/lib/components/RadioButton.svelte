<script lang="ts">
	export let selected = false;
	export let clazz = '';
</script>

<div
	class={`flex h-4 w-4 items-center justify-center rounded-full bg-grey-line ${
		selected ? 'border-[1.5px] border-blue-primary' : ''
	} ${clazz}`}
>
	{#if selected}
		<div class="h-2 w-2 rounded-full bg-blue-primary" />
	{/if}
</div>
