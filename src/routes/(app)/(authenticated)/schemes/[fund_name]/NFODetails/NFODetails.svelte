<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { getDateTimeProperties } from '$lib/utils/helpers/date';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	let schemeDetails: SchemeDetails;
	const nfoStartDate = getDateTimeProperties(schemeDetails?.nfoStartDate);
	const nfoEndDate = getDateTimeProperties(schemeDetails?.nfoEndDate);
	const nfoAllotmentDate = getDateTimeProperties(schemeDetails?.nfoAllotmentDate);
	export { schemeDetails };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:pb-4">
	<header class="">
		<section
			class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
		>
			<section class="flex items-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
					<WMSIcon name="nfo-icon" />
				</div>
				<h2 class="ml-3 flex items-center text-left font-normal text-black-title">
					<span>NFO Details</span>
				</h2>
			</section>
		</section>
	</header>
	<section class="origin-top transition duration-100">
		<div class="flex flex-col px-3 py-4">
			<div class="flex flex-col gap-2 sm:flex-row">
				<div class="flex flex-col rounded-lg bg-grey py-3 pl-3 font-normal sm:grow sm:basis-0">
					<div class="text-xs text-grey-body">Open Date</div>
					<span class="mt-1 text-black-title"
						>{`${nfoStartDate.date} ${nfoStartDate.month} ${nfoStartDate.year}`}</span
					>
				</div>
				<div class="flex flex-col rounded-lg bg-grey py-3 pl-3 font-normal sm:grow sm:basis-0">
					<div class="text-xs text-grey-body">Close Date</div>
					<span class="mt-1 text-black-title"
						>{`${nfoEndDate.date} ${nfoEndDate.month} ${nfoEndDate.year}`}</span
					>
				</div>
				<div class="flex flex-col rounded-lg bg-grey py-3 pl-3 font-normal sm:grow sm:basis-0">
					<div class="text-xs text-grey-body">Allotment Date</div>
					<span class="mt-1 text-black-title"
						>{`${nfoAllotmentDate.date} ${nfoAllotmentDate.month} ${nfoAllotmentDate.year}`}</span
					>
				</div>
			</div>
		</div>
	</section>
</article>
