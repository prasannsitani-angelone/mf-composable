<script>
	import { WMSIcon } from 'wms-ui-component';
	export let height = 20;
	export let width = 23;
	export let stroke = '#425061';
</script>

<section>
	<WMSIcon name="cart-outlined" {height} {width} class={$$props.class} {stroke} />
</section>
