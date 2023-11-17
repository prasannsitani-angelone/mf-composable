<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { calculateYearDiffrence } from '$lib/utils';

	let schemeDetails: SchemeDetails;

	const fundManagerInitials = (name = '') => {
		return (
			name
				?.split(' ')
				?.map((n) => n[0])
				?.join('') || ''
		);
	};
	const getStartDate = (date: Date = new Date()) => {
		const month = new Date(date).toLocaleString('default', { month: 'short' });
		const year = new Date(date).getFullYear();

		return `${month} ${year}`;
	};

	// let fundManagerAge = calculateYearDiffrence(new Date(fundManager?.startDate))
	export { schemeDetails };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm">
	<header>
		<section
			class="flex cursor-pointer items-center justify-between p-4 pb-2 pt-6 text-lg hover:text-blue-800 sm:px-6"
		>
			<section class="flex items-center">
				<h2 class="flex items-center text-left text-base font-medium text-black-title">
					<span> Fund Manager</span>
				</h2>
			</section>
		</section>
	</header>
	<section class="origin-top transition duration-100">
		<article class="px-4 sm:px-6">
			{#each schemeDetails?.fundManagerInfo || [] as fundManager}
				{@const fundManagerAge = calculateYearDiffrence(new Date(fundManager?.startDate))}
				<section class="flex items-center rounded">
					<div
						class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-primary/[.12]"
					>
						<span class="text-sm font-medium text-blue-primary">
							{fundManagerInitials(fundManager?.name)}
						</span>
					</div>
					<div>
						<h3 class="text-sm font-medium text-black-title sm:text-base">
							{fundManager?.name}
						</h3>
						<h4 class="text-xs font-normal text-grey-body sm:text-sm">
							{getStartDate(fundManager?.startDate)} - Present | {fundManagerAge} year{fundManagerAge >
							1
								? 's'
								: ''}
						</h4>
					</div>
				</section>
			{/each}
		</article>
	</section>
</article>
