<script lang="ts">
	import ScissorsIcon from '$lib/images/icons/ScissorsIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	let schemeDetails: SchemeDetails;
	const taxImplications = schemeDetails.taxImplications || [];
	export { schemeDetails };
</script>

<section class="border-b p-4">
	<header class="mb-5 flex items-center">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
			<ScissorsIcon />
		</div>

		<h3 class="ml-4 text-lg font-medium text-black-title">Tax Implications</h3>
	</header>
	<article class="relative left-0 top-0 flex flex-col gap-6 sm:hidden">
		<div class="relative flex">
			<div class="h-4 w-4 rounded-full border-4 border-green-buy" />
			<div class="ml-2">
				<h4 class="mb-1 text-sm text-grey-body">
					{taxImplications[0]?.header}
				</h4>
				<h5 class="text-sm font-medium text-black-title">
					{taxImplications[0]?.value}
				</h5>
			</div>
		</div>
		<div
			class="absolute left-2 top-11 h-9 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-grey-line"
		/>
		<div class="relative flex ">
			<div class="h-4 w-4 rounded-full border-4 border-green-buy" />
			<div class="ml-2">
				<h4 class="mb-1 text-sm text-grey-body">
					{taxImplications[1]?.header}
				</h4>
				<h5 class="text-sm font-medium text-black-title">
					{taxImplications[1]?.value}
				</h5>
			</div>
		</div>
	</article>
</section>
