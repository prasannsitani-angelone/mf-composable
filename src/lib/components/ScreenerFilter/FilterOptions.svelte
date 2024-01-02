<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import type { FilterOption } from '$lib/types/ScreenerFilters';
	import { Checkbox, WMSIcon } from 'svelte-components';
	import FilterOptions from '$components/ScreenerFilter/FilterOptions.svelte';
	import { createEventDispatcher } from 'svelte';
	import RangeSelector from './RangeSelector.svelte';
	import SearchIcon from '$lib/images/icons/SearchIcon.svelte';

	export let selectedFilter: FilterOption[] = [];
	export let filterType = '';
	export let filterLabel = '';
	export let showSearch = false;
	export let sections = [];

	const dispatch = createEventDispatcher();

	$: modifiedSelectedFilter = selectedFilter;

	let filterSearchQuery = '';

	const handleOptionClick = (filter: FilterOption, e: Event) => {
		dispatch('optionChange', filter);
		e?.stopPropagation();
		e.preventDefault();
	};

	const handleOptionTextClick = (filter: FilterOption, e: Event) => {
		if (!filter?.options?.length) {
			handleOptionClick(filter, e);
		}
	};

	const handleRangeChange = (filter: FilterOption) => {
		dispatch('rangeChange', filter);
	};

	const onFilterQueryInputChange = () => {
		if (showSearch) {
			modifiedSelectedFilter = selectedFilter?.filter((item) =>
				item?.label?.toLowerCase()?.includes(filterSearchQuery?.toLowerCase())
			);
		}
	};

	const updateSearchResults = () => {
		if (filterSearchQuery?.length) {
			onFilterQueryInputChange();
		}
	};

	const handleFilterQueryInputFocus = () => {
		const filterQueryInputElement = document?.getElementById(`filterInput-${filterLabel}`);
		filterQueryInputElement?.focus();
	};

	$: filterSearchQuery, onFilterQueryInputChange();
	$: selectedFilter, updateSearchResults();
</script>

<section>
	{#if showSearch}
		<section>
			<button
				class="flex w-full cursor-text items-center justify-start"
				on:click={handleFilterQueryInputFocus}
			>
				<div class="m-1 flex w-full items-center rounded-3xl border px-4 py-1">
					<SearchIcon />
					<input
						id={`filterInput-${filterLabel}`}
						inputmode="text"
						placeholder={`Search ${filterLabel}`}
						bind:value={filterSearchQuery}
						class="ml-2 w-full text-xs font-normal leading-none text-black-title outline-none"
						on:input={onFilterQueryInputChange}
					/>
				</div>
			</button>
		</section>
	{/if}

	{#if filterType === 'multi' && sections?.length > 0}
		{#each sections as section, index (index)}
			{@const list = modifiedSelectedFilter.filter((filter) => {
				return filter[section];
			})}
			{#if list?.length > 0}
				<div class="pt-3 text-sm text-black-bolder">{section}</div>
				{#each list as filter (filter?.label)}
					{#if filter[section]}
						<article class="mb-3 ml-1">
							<AccordianCardComponent
								data={{ title: '' }}
								titleFontSize="text-base"
								class="rounded-lg bg-white text-sm font-normal text-black-title !shadow-none"
								headerClass="!p-0 !md:px-0 !md:py-0"
							>
								<svelte:fragment slot="accordionTitle">
									<article class="flex items-center">
										<Checkbox
											on:click={(e) => handleOptionClick(filter, e)}
											class="ml-[-4px]"
											checked={filter?.selected}
											label=""
										/>
										<div class="flex flex-1 items-center justify-between">
											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<!-- svelte-ignore a11y-no-static-element-interactions -->
											<div
												on:click={(e) => handleOptionTextClick(filter, e)}
												class="p-2 px-1 text-xs font-normal text-black-key md:cursor-pointer {filter
													?.options?.length
													? ''
													: 'ml-2'}"
											>
												<span>
													{filter?.label}
												</span>
												{#if filter?.count}
													<span class="ml-1 rounded bg-purple-background px-1 text-xs font-medium"
														>{filter?.count || ''}</span
													>
												{/if}
											</div>
										</div>
									</article>
								</svelte:fragment>

								<svelte:fragment slot="accordionBody">
									{#if filter?.options?.length}
										<FilterOptions
											selectedFilter={filter?.options}
											filterType={filter?.type}
											filterLabel={filter?.label}
											showSearch={filter?.search}
											sections={filter.section || []}
											on:optionChange={(e) => handleOptionClick(e?.detail, e)}
											on:rangeChange={(e) => handleRangeChange(e?.detail)}
										/>
									{/if}
								</svelte:fragment>

								<svelte:fragment slot="arrowIcon">
									<div>
										{#if filter?.options?.length}
											<div class="px-3">
												<WMSIcon class="h-2.5 w-2.5" name="arrow-expand" stroke={'#181F29A0'} />
											</div>
										{/if}
									</div>
								</svelte:fragment>
							</AccordianCardComponent>
						</article>
					{/if}
				{/each}
			{/if}
		{/each}
	{:else}
		{#each modifiedSelectedFilter as filter (filter?.label)}
			{#if filterType === 'multi'}
				<article class="mb-3 ml-1">
					<AccordianCardComponent
						data={{ title: '' }}
						titleFontSize="text-base"
						class="rounded-lg bg-white text-sm font-normal text-black-title !shadow-none"
						headerClass="!p-0 !md:px-0 !md:py-0"
					>
						<svelte:fragment slot="accordionTitle">
							<article class="flex items-center">
								<Checkbox
									on:click={(e) => handleOptionClick(filter, e)}
									class="ml-[-4px]"
									checked={filter?.selected}
									label=""
								/>
								<div class="flex flex-1 items-center justify-between">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										on:click={(e) => handleOptionTextClick(filter, e)}
										class="p-2 px-1 text-xs font-normal text-black-key md:cursor-pointer {filter
											?.options?.length
											? ''
											: 'ml-2'}"
									>
										<span>
											{filter?.label}
										</span>
										{#if filter?.count}
											<span class="ml-1 rounded bg-purple-background px-1 text-xs font-medium"
												>{filter?.count || ''}</span
											>
										{/if}
									</div>
								</div>
							</article>
						</svelte:fragment>

						<svelte:fragment slot="accordionBody">
							{#if filter?.options?.length}
								<FilterOptions
									selectedFilter={filter?.options}
									filterType={filter?.type}
									filterLabel={filter?.label}
									showSearch={filter?.search}
									sections={filter.section || []}
									on:optionChange={(e) => handleOptionClick(e?.detail, e)}
									on:rangeChange={(e) => handleRangeChange(e?.detail)}
								/>
							{/if}
						</svelte:fragment>

						<svelte:fragment slot="arrowIcon">
							<div>
								{#if filter?.options?.length}
									<div class="px-3">
										<WMSIcon class="h-2.5 w-2.5" name="arrow-expand" stroke={'#181F29A0'} />
									</div>
								{/if}
							</div>
						</svelte:fragment>
					</AccordianCardComponent>
				</article>
			{:else if filterType === 'range'}
				<article class="mx-3 mb-3">
					<RangeSelector {filter} on:rangeChange={(e) => handleRangeChange(e?.detail)} />
				</article>
			{:else if filterType === 'outer'}
				<AccordianCardComponent
					data={{ title: '' }}
					titleFontSize="text-base"
					class="!mt-0 rounded-none border-b border-grey-line bg-white px-5 py-3 text-sm font-medium text-black-title !shadow-none"
					headerClass="!p-0 !md:px-0 !md:py-0"
				>
					<svelte:fragment slot="accordionTitle">
						<article class="flex items-center">
							<div class="flex flex-1 items-center justify-between">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div
									on:click={(e) => handleOptionTextClick(filter, e)}
									class="p-2 px-1 text-xs font-normal text-black-bolder md:cursor-pointer {filter
										?.options?.length
										? ''
										: 'ml-2'}"
								>
									<span>
										{filter?.label}
									</span>
									{#if filter?.count}
										<div class="ml-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-blue-primary" />
									{/if}
								</div>
							</div>
						</article>
					</svelte:fragment>

					<svelte:fragment slot="accordionBody">
						{#if filter?.options?.length}
							<FilterOptions
								selectedFilter={filter?.options}
								filterType={filter?.type}
								filterLabel={filter?.label}
								showSearch={filter?.search}
								sections={filter.section || []}
								on:optionChange={(e) => handleOptionClick(e?.detail, e)}
								on:rangeChange={(e) => handleRangeChange(e?.detail)}
							/>
						{/if}
					</svelte:fragment>

					<svelte:fragment slot="arrowIcon">
						<div>
							{#if filter?.options?.length}
								<div class="px-3">
									<WMSIcon class="h-2.5 w-2.5" name="arrow-expand" stroke={'#181F29A0'} />
								</div>
							{/if}
						</div>
					</svelte:fragment>
				</AccordianCardComponent>
			{/if}
		{/each}
	{/if}
</section>
