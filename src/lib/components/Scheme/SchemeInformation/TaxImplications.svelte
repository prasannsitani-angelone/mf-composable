<script lang="ts">
	import ScissorsIcon from '$lib/images/icons/ScissorsIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import WMSIcon from '$components/WMSIcon.svelte';

	let schemeDetails: SchemeDetails;
	const taxImplications = schemeDetails.taxImplications || [];
	export { schemeDetails };
</script>

{#if taxImplications.length}
	<section class="border-b p-4">
		<header class="mb-5 flex items-center">
			<div class="flex h-12 w-12 items-center justify-center rounded-full bg-background">
				<ScissorsIcon />
			</div>

			<h3 class="ml-4 text-lg font-normal text-title">Tax Implications</h3>
		</header>
		<article class="hidden sm:flex">
			<div class="relative mr-3 w-full rounded border py-4 pl-5 font-normal">
				<h4 class="text-sm text-body">
					{taxImplications[0]?.header}
				</h4>
				<h5 class="text-sm text-title">
					{taxImplications[0]?.value}
				</h5>
				<div
					class="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full border-4 border-buy"
				/>
			</div>

			<div class="mr-3 flex items-center justify-center">
				<WMSIcon name="polygon-right-small" class="mr-1" />
				<WMSIcon name="polygon-right-medium" class="mr-1" />
				<WMSIcon name="polygon-right-small" />
			</div>
			<div class="relative w-full rounded border py-4 pl-5 font-normal">
				<h4 class="text-sm text-body">
					{taxImplications[1]?.header}
				</h4>
				<h5 class="text-sm text-title">
					{taxImplications[1]?.value}
				</h5>
				<div
					class="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-buy"
				/>
			</div>
		</article>

		<article class="relative left-0 top-0 flex flex-col gap-6 sm:hidden">
			<div class="relative flex">
				<div class="h-4 w-4 rounded-full border-4 border-buy" />
				<div class="ml-2">
					<h4 class="mb-1 text-sm text-body">
						{taxImplications[0]?.header}
					</h4>
					<h5 class="text-sm font-normal text-title">
						{taxImplications[0]?.value}
					</h5>
				</div>
			</div>
			<div
				class="absolute left-2 top-11 h-9 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-border"
			/>
			<div class="relative flex">
				<div class="h-4 w-4 rounded-full border-4 border-buy" />
				<div class="ml-2">
					<h4 class="mb-1 text-sm text-body">
						{taxImplications[1]?.header}
					</h4>
					<h5 class="text-sm font-normal text-title">
						{taxImplications[1]?.value}
					</h5>
				</div>
			</div>
		</article>
	</section>
{/if}
