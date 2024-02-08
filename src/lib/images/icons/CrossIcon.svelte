<script lang="ts">
	let clazz = '';
	let onClick: svelte.JSX.MouseEventHandler<SVGSVGElement> | null = null;
	let stroke = 'var(--TITLE)';
	export { clazz as class, onClick, stroke };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg
	width="24"
	height="24"
	class={`${clazz}`}
	on:click={onClick}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path d="M18 6L6 18" {stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
	<path d="M18 18L6 6" {stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
