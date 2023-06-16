<script lang="ts">
	let index: number;
	export { index };
</script>

<div
	class="carousel-item flex-shrink-0 transition-transform carousel-active-{index} {$$props.class}"
>
	<slot />
</div>

<style>
	.carousel-item {
		display: block;
		transform: translateZ(0);
		backface-visibility: hidden;
	}
</style>
