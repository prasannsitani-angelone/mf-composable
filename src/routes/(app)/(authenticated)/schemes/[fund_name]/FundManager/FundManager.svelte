<script lang="ts">
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

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
				<section class="flex items-center rounded">
					<div
						class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-csm"
					>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-primary/[.12]"
						>
							<span class="text-sm font-medium text-blue-primary">
								{fundManagerInitials(fundManager?.name)}
							</span>
						</div>
					</div>
					<div>
						<h3 class="text-sm font-normal text-black-title sm:text-base">
							{fundManager?.name}
						</h3>
						<h4 class="text-xs font-normal text-grey-body sm:text-sm">
							<span>Fund Manager since </span>
							{getStartDate(fundManager?.startDate)}
						</h4>
					</div>
				</section>
			{/each}
		</article>
	</section>
</article>
