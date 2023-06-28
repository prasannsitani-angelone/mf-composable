<script>
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	export let height = 20;
	export let width = 23;
</script>

<section>
	<WMSIcon name="cart-filled" {height} {width} class={$$props.class} />
</section>
