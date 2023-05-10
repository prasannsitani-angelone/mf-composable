<script lang="ts">
	import NoOrdersImage from '$lib/images/icons/NoOrdersImage.svelte';
	export let title: string;
</script>

<article
	class="flex flex-col items-center rounded-lg bg-white p-4 text-black-title shadow-csm lg:py-10 {$$props.class}"
>
	<NoOrdersImage class="m-3" />
	<section class="mt-6 flex flex-col items-center">
		<div class="text-base font-medium">
			{title}
		</div>
	</section>
</article>
