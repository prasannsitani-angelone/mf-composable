<script lang="ts">
	let index: number;
	let id: string;
	export { index, id };
</script>

<div
	class="carousel-item-{id} w-full flex-shrink-0 transition-transform carousel-active-{index}-{id} {$$props.class}"
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
