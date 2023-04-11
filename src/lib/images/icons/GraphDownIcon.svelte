<script lang="ts">
	export let width = '16';
	export let height = '16';
</script>

<svg
	{width}
	{height}
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={$$props.class}
>
	<path
		d="M14.5 12.5L8.5 6.5L6 9L1.5 4.5"
		stroke="#3F5BD9"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M14.5 8.5V12.5H10.5"
		stroke="#3F5BD9"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
