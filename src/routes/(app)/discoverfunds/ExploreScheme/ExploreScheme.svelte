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

<header class="flex flex-col p-6 pb-2 pt-4 lg:pt-6">
	<h1 class="text-lg font-normal text-title">Discover Mutual Funds</h1>
</header>
<section class="mb-3 flex flex-wrap px-4 pb-4 sm:px-6 lg:items-center lg:justify-center">
	{#each searchOptions || [] as option}
		<article
			class="group mr-0 flex basis-1/4 cursor-pointer items-center justify-center rounded-lg bg-background-alt py-4 hover:bg-background sm:justify-start sm:pl-6"
		>
			<Link
				to={getExploreFundsNavigationPath(option)}
				class="flex h-full flex-col lg:h-auto lg:flex-row lg:items-center"
				on:linkClicked={() => onExploreFundsClickEvent(option)}
			>
				<div
					class="my-auto flex h-9 w-9 self-center group-hover:bg-background-alt lg:h-14 lg:w-14 lg:items-center lg:justify-center"
				>
					<img src={option.iconUrl} class="h-9 w-9" alt="option.name" loading="lazy" />
				</div>
				<h2
					class="mt-2 px-3 text-center text-sm font-normal text-title lg:ml-3 lg:mt-0 lg:pl-0 lg:pr-3 lg:text-left lg:text-base"
				>
					{option.name}
				</h2>
				<div class="h-full" />
			</Link>
		</article>
	{/each}
</section>
