<script lang="ts">
	import UserIcon from '$lib/images/icons/UserIcon.svelte';

	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { getContext } from 'svelte';
	import { SCHEME_DETAILS_KEY } from './constants';

	let { getSchemeDetails } = getContext(SCHEME_DETAILS_KEY);
	// const schemeDetails: SchemeDetails = getSchemeDetails();

	const fundManagerInitials = (name = '') => {
		return (
			name
				?.split(' ')
				?.map((n) => n[0])
				?.join('') || ''
		);
	};
</script>

{#await getSchemeDetails()}
	Loading...
{:then schemeDetails}
	<article class="mt-4 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm">
		<header class="mb-6 border border-b border-grey-line">
			<section
				class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
			>
				<section class="flex items-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
						<UserIcon />
					</div>
					<h2 class="ml-3 flex items-center text-left font-medium text-black-title">
						<span> Fund Manager</span>
					</h2>
				</section>
			</section>
		</header>
		<section class="origin-top transition duration-100">
			<article class="px-6">
				{#each schemeDetails?.fundManagerInfo as fundManager}
					<section class="flex items-center rounded border border-grey-line px-4 py-3">
						<div
							class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-csm"
						>
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-primary/[.12]"
							>
								<span class="text-sm font-semibold text-blue-primary">
									{fundManagerInitials(fundManager?.name)}
								</span>
							</div>
						</div>
						<div>
							<h3 class="text-sm font-medium text-black-title sm:text-base">
								{fundManager?.name}
							</h3>
						</div>
					</section>
				{/each}
			</article>
		</section>
	</article>
{:catch error}
	Error
{/await}
