<script lang="ts">
	enum IconSize {
		sm = 'h-12 w-12',
		xs = 'h-9 w-9',
		xs2 = 'h-7 w-7'
	}
	let src: string;
	let alt = '';
	let lazy = 'lazy';
	let imageClass = '';
	let size: string = IconSize.sm;
	export { src, alt, lazy, imageClass, size };
	let iconSize: string;
	$: {
		iconSize = IconSize[size] || IconSize.sm;
	}
</script>

<div
	class="light mr-3 flex bg-background-alt {iconSize} shrink-0 items-center justify-center rounded-full border object-cover group-hover:bg-background-alt {$$props.class}"
>
	<img {src} loading={lazy} {alt} class=" aspect-square {imageClass}" width="100%" height="100%" />
</div>
