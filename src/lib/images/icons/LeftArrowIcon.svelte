<script lang="ts">
	let clazz = '';
	let onClick: svelte.JSX.MouseEventHandler<SVGSVGElement> | null = null;
	let stroke = 'var(--TITLE)';
	export { clazz as class, onClick };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg
	width="16"
	height="16"
	viewBox="0 0 16 16"
	fill="none"
	class={`${clazz}`}
	on:click={onClick}
	xmlns="http://www.w3.org/2000/svg"
>
	<path d="M15 8H1" {stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
	<path
		d="M8 15L1 8L8 1"
		{stroke}
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
