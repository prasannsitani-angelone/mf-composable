<script lang="ts">
	import Link from '$components/Link.svelte';
	import { base } from '$app/paths';
	import type { SearchOptionsEntity } from '$lib/types/IDiscoverFunds';
	import { getExploreFundsNavigationPath } from '$lib/utils';
	import { exploreCardClickEvent } from './analytics';
	import { getDeeplinkForUrl } from '$lib/utils/helpers/deeplinks';
	import { page } from '$app/stores';

	let searchOptions: SearchOptionsEntity[];

	export { searchOptions };

	function onExploreFundsClickEvent(option: SearchOptionsEntity) {
		const url = `${$page.url.origin}${base}${getExploreFundsNavigationPath(option)}`;
		const eventMetaData = {
			Type: option.name,
			URL: getDeeplinkForUrl(url)
		};
		exploreCardClickEvent(eventMetaData);
	}
</script>

<header class="flex flex-col p-6 pb-5">
	<h1 class="text-lg font-medium text-black-title">Discover Mutual Funds</h1>
</header>
<section class="mb-3 flex flex-wrap items-center justify-center px-4 pb-6 sm:px-6">
	{#each searchOptions || [] as option}
		<article
			class="group mr-0 flex basis-1/4 cursor-pointer items-center justify-center rounded-lg bg-white py-4 hover:bg-grey sm:justify-start sm:pl-6"
		>
			<Link
				to={getExploreFundsNavigationPath(option)}
				class="flex flex-col items-center lg:flex-row"
				on:linkClicked={() => onExploreFundsClickEvent(option)}
			>
				<div class="flex h-9 w-9 items-center justify-center group-hover:bg-white lg:h-14 lg:w-14">
					<img src={option.iconUrl} class="h-9 w-9" alt="option.name" loading="lazy" />
				</div>
				<h2 class="mt-2 text-sm font-medium text-black-title lg:ml-3 lg:mt-0 lg:text-base">
					{option.name}
				</h2>
			</Link>
		</article>
	{/each}
</section>
