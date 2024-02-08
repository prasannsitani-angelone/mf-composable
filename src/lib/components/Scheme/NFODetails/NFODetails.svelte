<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import LockInPeriod from '../LockInPeriod/LockInPeriod.svelte';

	let schemeDetails: SchemeDetails;
	const nfoStartDate = getDateTimeString(schemeDetails?.nfoStartDate);
	const nfoEndDate = getDateTimeString(schemeDetails?.nfoEndDate);
	const nfoAllotmentDate = schemeDetails?.nfoAllotmentDateString || 'NA';
	export { schemeDetails };
</script>

<article
	class="mt-4 max-w-4xl rounded-lg bg-background-alt text-sm shadow-csm sm:pb-4 {$$props.class}"
>
	<header class="">
		<section
			class="flex cursor-pointer items-center justify-between p-4 pb-3 text-lg md:px-6 md:pt-6"
		>
			<section class="flex items-center">
				<h2 class="flex items-center text-left text-base font-medium text-title">
					<span>NFO Details</span>
				</h2>
			</section>
		</section>
	</header>
	<section>
		<div class="flex px-6 pb-4">
			<div class="flex flex-col flex-wrap gap-2 sm:flex-row sm:gap-0">
				<div class="flex flex-col border-b py-3 font-normal sm:grow sm:basis-1/2">
					<div class="text-xs text-body">Open Date</div>
					<span class="mt-1 text-title">{`${nfoStartDate}`}</span>
				</div>
				<div class="flex flex-col border-b py-3 font-normal sm:grow sm:basis-1/2">
					<div class="text-xs text-body">Close Date</div>
					<span class="mt-1 text-title">{`${nfoEndDate}`}</span>
				</div>
				<div class="flex flex-col border-b py-3 font-normal sm:grow sm:basis-1/2 sm:border-none">
					<div class="text-xs text-body">Allotment Date</div>
					<span class="mt-1 text-title">{`${nfoAllotmentDate}`}</span>
				</div>
				<div class="flex flex-col py-3 font-normal sm:grow sm:basis-1/2">
					<div class="text-xs uppercase text-body">Nav</div>
					<span class="mt-1 text-title">₹{schemeDetails?.navValue}</span>
				</div>

				<LockInPeriod {schemeDetails} />
			</div>
		</div>
	</section>
</article>
