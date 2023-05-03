<script lang="ts">
	import { WMSIcon } from 'wms-ui-component';

	export let titleText = '';
</script>

<section class="my-20 w-full md:w-[345px]">
	<article class="flex flex-col items-center justify-center">
		<WMSIcon width="160px" height="160px" name="not-allowed" />
		<span class="mx-12 text-center text-base font-medium text-black-title">
			{titleText}
		</span>
	</article>
</section>
