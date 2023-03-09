<script lang="ts">
	let src: string;
	let alt = '';
	let lazy = 'lazy';
	export { src, alt, lazy };
</script>

<div
	class="mr-3 flex h-12 w-12 shrink-0 items-center rounded-full border border-grey-line shadow-csm group-hover:bg-white"
>
	<img {src} loading={lazy} width="48" height="48" {alt} />
</div>
