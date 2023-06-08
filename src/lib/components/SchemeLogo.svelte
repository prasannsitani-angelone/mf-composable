<script lang="ts">
	let src: string;
	let alt = '';
	let lazy = 'lazy';
	let imageClass = '';
	export { src, alt, lazy, imageClass };
</script>

<div
	class={`mr-3 flex h-12 w-12 shrink-0 items-center rounded-full border border-grey-line object-cover shadow-csm group-hover:bg-white ${$$props.class}`}
>
	<img {src} loading={lazy} width="48" height="48" {alt} class={imageClass} />
</div>
