<script lang="ts">
	import Link from '$components/Link.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import type { SearchOptionsEntity } from '$lib/types/IDiscoverFunds';
	import { getExploreFundsNavigationPath } from '$lib/utils';
	let searchOptions: SearchOptionsEntity[];

	export { searchOptions };
</script>

<header class="flex flex-col p-6 pb-5">
	<h1 class="text-lg font-medium text-black-title">Discover Mutual Funds</h1>
</header>
<section class="flex flex-wrap items-center justify-center px-4 sm:px-6">
	{#each searchOptions || [] as option}
		<article
			class="group mr-0 flex basis-1/3 cursor-pointer items-center justify-center rounded-lg bg-white py-4 hover:bg-grey sm:justify-start sm:pl-6"
		>
			<Link
				to={getExploreFundsNavigationPath(option)}
				class="flex flex-col items-center lg:flex-row"
			>
				<div
					class="flex h-9 w-9 items-center justify-center rounded-full border p-2 group-hover:bg-white lg:h-14 lg:w-14"
				>
					<img
						src={option.iconUrl}
						width="18"
						height="18"
						class="md:h-6 md:w-6"
						alt="option.name"
					/>
				</div>
				<h2 class="mt-2 text-sm font-medium text-black-title lg:mt-0 lg:ml-3 lg:text-base">
					{option.name}
				</h2>
			</Link>
		</article>
	{/each}
</section>
<footer class="mt-3 border-t border-grey-line">
	<div
		class="flex cursor-pointer items-center justify-center py-6 text-sm font-semibold uppercase text-blue-primary sm:py-5"
	>
		<Link to="/" class="flex items-center">
			<span class="uppercase">Explore all funds</span>
			<RightIcon class="ml-3" stroke="#3F5BD9" />
		</Link>
	</div>
</footer>
