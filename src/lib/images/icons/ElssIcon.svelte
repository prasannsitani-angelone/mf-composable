<script lang="ts">
	export let width = '24';
	export let height = '24';
</script>

<svg
	{width}
	{height}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={$$props.class}
>
	<path
		d="M15 12H9"
		stroke="#3F5BD9"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M15 16H9"
		stroke="#3F5BD9"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M13 8H9"
		stroke="#3F5BD9"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<rect x="5" y="3" width="14" height="18" rx="1.25" stroke="#3F5BD9" stroke-width="1.5" />
</svg>
