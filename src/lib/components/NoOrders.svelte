<script lang="ts">
	import NoOrdersImage from '$lib/images/icons/NoOrdersImage.svelte';
	export let title: string;
</script>

<article
	class="flex flex-col items-center rounded-lg bg-background-alt p-4 text-title shadow-csm lg:py-10 {$$props.class}"
>
	<NoOrdersImage class="m-3" />
	<section class="mt-6 flex w-64 flex-col items-center text-center text-body">
		<div class="text-sm font-normal">
			{title}
		</div>
	</section>
</article>
