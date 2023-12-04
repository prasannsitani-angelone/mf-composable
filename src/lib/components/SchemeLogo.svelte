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
	class="mr-3 flex {iconSize} shrink-0 items-center justify-center rounded-full border border-grey-line object-cover group-hover:bg-white {$$props.class}"
>
	<img {src} loading={lazy} {alt} class=" aspect-square {imageClass}" />
</div>
