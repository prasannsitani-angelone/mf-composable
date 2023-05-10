<script lang="ts">
	export let stroke = '#6A7582';
	export let width = 6;
	export let height = 10;
</script>

<svg
	{width}
	{height}
	viewBox="0 0 6 10"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={$$props.class}
>
	<path
		d="M1 1L5 5L1 9"
		{stroke}
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
