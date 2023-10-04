<script lang="ts">
	import ErrorFetchingData from '$lib/images/ErrorFetchingData.svg';

	export let title = '';
	export let message = '';
</script>

<section class="rounded-lg bg-white px-4 py-6 text-center max-sm:shadow-csm sm:py-7">
	<div class="m-auto max-w-[500px] text-center">
		<img
			src={ErrorFetchingData}
			class="inline-block"
			loading="lazy"
			alt="Illustration shoeing first time import"
		/>
		<div class="mb-3 mt-5 text-base font-normal text-black-title sm:mt-8">
			{title}
		</div>
		<div class="mb-6 text-sm text-grey-body">
			{message}
		</div>
	</div>
</section>
