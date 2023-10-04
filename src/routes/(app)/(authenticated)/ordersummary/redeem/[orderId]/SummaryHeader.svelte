<script lang="ts">
	import TickWithSparkles from '$lib/images/TickWithSparkles.svg';
	import TickIcon from '$lib/images/icons/TickIcon.svelte';

	export let heading = '';
	export let subHeading = '';
</script>

<section>
	<!-- Mobile header -->
	<article
		class="mx-2 mt-2 flex flex-col items-center rounded-lg bg-white px-6 py-4 shadow-csm md:hidden {$$props?.class ||
			''}"
	>
		<img
			src={TickWithSparkles}
			class="inline-block"
			loading="lazy"
			alt="Illustration showing not able to fetch chart data"
		/>
		<span class="mt-6 text-lg font-normal text-black-title">
			{heading}
		</span>
	</article>

	<!-- Desktop header -->
	<article
		class="hidden flex-col items-start rounded-lg border-l-4 border-green-buy bg-white px-6 py-4 shadow-csm md:flex {$$props?.class ||
			''}"
	>
		<div class="flex items-center">
			<span class="text-lg font-normal text-black-title">
				{heading}
			</span>
			<div
				class="ml-2 flex flex-col items-center justify-center bg-green-buy"
				style="height: 16px; width: 16px; border-radius: 8px;"
			>
				<TickIcon stroke="white" height={10} width={10} class="bg-green-buy" />
			</div>
		</div>

		<div class="mt-2 text-sm">
			{subHeading}
		</div>
	</article>
</section>
