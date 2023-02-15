<script lang="ts">
	let clazz = '';
	let onClick: svelte.JSX.MouseEventHandler<SVGSVGElement> | null = null;
	export { clazz as class, onClick };
</script>

<svg
	width="16"
	height="16"
	viewBox="0 0 16 16"
	fill="none"
	class={`${clazz}`}
	on:click={onClick}
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M15 8H1"
		stroke="#2A394E"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M8 15L1 8L8 1"
		stroke="#2A394E"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
