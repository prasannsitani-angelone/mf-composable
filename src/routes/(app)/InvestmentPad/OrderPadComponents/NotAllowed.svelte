<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	export let titleText = '';
</script>

<section class="my-20 w-full md:w-[345px] {$$props?.class}">
	<article class="flex flex-col items-center justify-center">
		<WMSIcon width={160} height={160} name="not-allowed" />
		<span class="mx-12 text-center text-base font-normal text-title">
			{titleText}
		</span>
	</article>
</section>
