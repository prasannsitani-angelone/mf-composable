<script lang="ts">
	import type { CategoryOptionsEntity, DashboardCategoryEntity } from '$lib/types/IDiscoverFunds';
	import { getCategoriesFundsNavigationPath } from '$lib/utils';
	import { Link } from 'svelte-components';
	import { exploreMFFilter } from '../../../routes/(app)/explorefunds/[slug]/analytics';

	export let category: DashboardCategoryEntity;

	const categoryOptionClickEvent = (option: CategoryOptionsEntity) => {
		exploreMFFilter({ type: 'click', Category: option.name, label: category.name });
	};
</script>

<section class="flex flex-wrap px-4 py-3 sm:px-6 lg:items-center lg:justify-center">
	{#each category.data || [] as option}
		<article
			class="group mr-0 flex basis-1/4 cursor-pointer items-center justify-center rounded-lg bg-white hover:bg-grey sm:justify-start sm:pl-6"
		>
			<Link
				to={getCategoriesFundsNavigationPath(option.id)}
				class="flex h-full flex-col lg:h-auto lg:flex-row lg:items-center"
				on:linkClicked={() => {
					categoryOptionClickEvent(option);
				}}
			>
				<div
					class="my-auto flex h-9 w-9 self-center lg:h-14 lg:w-14 lg:items-center lg:justify-center"
				>
					<img src={option.iconUrl} class="h-9 w-9" alt="option.name" loading="lazy" />
				</div>
				<h2
					class="mt-2 px-2 text-center text-sm font-normal text-black-title lg:ml-3 lg:mt-0 lg:pl-0 lg:pr-3 lg:text-left lg:text-base"
				>
					{option.name}
				</h2>
				<div class="h-full" />
			</Link>
		</article>
	{/each}
</section>
