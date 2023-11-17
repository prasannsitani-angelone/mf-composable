<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { getDateTimeProperties } from '$lib/utils/helpers/date';
	import LockInPeriod from '../LockInPeriod/LockInPeriod.svelte';

	let schemeDetails: SchemeDetails;
	const nfoStartDate = getDateTimeProperties(schemeDetails?.nfoStartDate);
	const nfoEndDate = getDateTimeProperties(schemeDetails?.nfoEndDate);
	const nfoAllotmentDate = getDateTimeProperties(schemeDetails?.nfoAllotmentDate);
	export { schemeDetails };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:pb-4">
	<header class="">
		<section
			class="flex cursor-pointer items-center justify-between p-4 pb-3 text-lg md:px-6 md:pt-6"
		>
			<section class="flex items-center">
				<h2 class="flex items-center text-left text-base font-medium text-black-title">
					<span>NFO Details</span>
				</h2>
			</section>
		</section>
	</header>
	<section>
		<div class="flex px-6 pb-4">
			<div class="flex flex-col flex-wrap gap-2 sm:flex-row sm:gap-0">
				<div class="flex flex-col border-b py-3 font-normal sm:grow sm:basis-1/2">
					<div class="text-xs text-black-bolder">Open Date</div>
					<span class="mt-1 text-black-title"
						>{`${nfoStartDate.date} ${nfoStartDate.month} ${nfoStartDate.year}`}</span
					>
				</div>
				<div class="flex flex-col border-b py-3 font-normal sm:grow sm:basis-1/2">
					<div class="text-xs text-black-bolder">Close Date</div>
					<span class="mt-1 text-black-title"
						>{`${nfoEndDate.date} ${nfoEndDate.month} ${nfoEndDate.year}`}</span
					>
				</div>
				<div class="flex flex-col border-b py-3 font-normal sm:grow sm:basis-1/2 sm:border-none">
					<div class="text-xs text-grey-body">Allotment Date</div>
					<span class="mt-1 text-black-title"
						>{`${nfoAllotmentDate.date} ${nfoAllotmentDate.month} ${nfoAllotmentDate.year}`}</span
					>
				</div>
				<div class="flex flex-col py-3 font-normal sm:grow sm:basis-1/2">
					<div class="text-xs text-grey-body">Nav</div>
					<span class="mt-1 text-black-title">₹{schemeDetails?.navValue}</span>
				</div>

				<LockInPeriod {schemeDetails} />
			</div>
		</div>
	</section>
</article>
