<script lang="ts">
	export let stroke = 'white';
	export let height = 8;
	export let width = 8;
</script>

<div>
	<svg
		{width}
		{height}
		viewBox="0 0 8 6"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class={$$props.class}
	>
		<path
			d="M1 3.321L2.774 5L7 1"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</div>
