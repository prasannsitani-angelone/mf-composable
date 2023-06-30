<script>
	import CartFilled from '$lib/wms_icons/CartFilled.svelte';
	export let height = 20;
	export let width = 23;
</script>

<section>
	<CartFilled {height} {width} class={$$props.class} />
</section>
