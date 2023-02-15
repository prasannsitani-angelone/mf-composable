<script lang="ts">
	let clazz = '';
	let onClick: svelte.JSX.MouseEventHandler<SVGSVGElement> | null = null;
	export { clazz as class, onClick };
</script>

<svg
	width="24"
	height="24"
	class={`${clazz}`}
	on:click={onClick}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M18 6L6 18"
		stroke="#2A394E"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M18 18L6 6"
		stroke="#2A394E"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
