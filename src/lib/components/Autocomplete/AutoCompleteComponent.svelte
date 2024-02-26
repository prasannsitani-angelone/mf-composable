<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import CrossIcon from '$lib/images/icons/CrossIcon.svelte';
	import SearchDarkIcon from '$lib/images/icons/SearchDarkIcon.svelte';
	import SearchIcon from '$lib/images/icons/SearchIcon.svelte';
	import { debounce } from '$lib/utils/helpers/debounce';
	import { createEventDispatcher } from 'svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';

	$: deviceType = $page?.data?.deviceType;
	const dispatch = createEventDispatcher();
	let getResults: (searchText: string) => WeeklyTopSchemesEntity[] | null;
	let handleResultClick: (item: WeeklyTopSchemesEntity, index: number) => void;
	let placeholderText: string;
	let searchPageLoaded: boolean;
	let inputVal = '';
	let parentResultClass = '';
	let searchInputClass = '';
	let searchMode: string;
	let results: WeeklyTopSchemesEntity[] | null = null;
	let inputRef: HTMLInputElement | null = null;
	let showResults = deviceType?.isMobile || true;
	let resultItemClicked = false;
	const resetResults = () => {
		results = null;
	};

	const resetData = () => {
		inputVal = '';
		results = null;
	};

	const handleShowResultSection = (val = false) => {
		if (deviceType?.isMobile || searchMode === 'switch') {
			return;
		}

		setTimeout(() => {
			showResults = val;
			dispatch('searchFocus', val);
			if (val) {
				handleInput();
			} else {
				resetResults();
			}
		}, 300);
	};

	const handleInput = debounce(() => {
		const searchText = (inputVal || '').trim();

		dispatch('searchInput', searchText);

		results = getResults(searchText);
	});

	const onSearchInputChange = (e: Event) => {
		// handling get results when search input value changes
		inputVal = (e.target as HTMLInputElement)?.value;

		handleInput();

		if (!inputVal || !inputVal.length) {
			resetResults();
		}
	};

	const handleResultItemClick = (item: WeeklyTopSchemesEntity, index: number) => {
		handleResultClick(item, index);
	};

	$: if (resultItemClicked) {
		resetData();
	}

	let classes = {
		container: 'py-3 mr-1 w-full border-none rounded-md',
		label: '',
		input:
			'w-full !border-none focus:outline-none placeholder-body md:placeholder-disabled !text-base !text-title font-normal lg:font-normal !input-xs !pl-0',
		error: '',
		parent: 'w-full'
	};

	$: if (searchPageLoaded && deviceType?.isMobile) {
		setTimeout(() => {
			inputRef?.focus();
		}, 300);
	}
	let initialSearchResult: WeeklyTopSchemesEntity[];
	export {
		getResults,
		placeholderText,
		searchPageLoaded,
		resultItemClicked,
		initialSearchResult,
		parentResultClass,
		searchInputClass,
		searchMode
	};
</script>

<article>
	<section class={`flex flex-col items-center justify-center ${$$props.class}`}>
		<!-- Search Input -->
		<div
			class="flex w-full cursor-text items-center rounded-md border lg:w-[440px] {searchInputClass}"
			class:rounded-b-none={showResults}
		>
			<article class="flex w-full items-center">
				<slot name="searchIcon">
					{#if !deviceType?.isBrowser}
						<SearchDarkIcon class="mx-4 mt-1 h-6 w-6" />
					{:else}
						<SearchIcon class="mx-4 text-disabled" />
					{/if}
				</slot>

				<TextInput
					id="searchInput"
					name="searchInput"
					bind:ref={inputRef}
					on:focus={() => handleShowResultSection(true)}
					on:blur={() => handleShowResultSection(false)}
					onInputChange={onSearchInputChange}
					bind:value={inputVal}
					{classes}
					placeholder={placeholderText || ''}
				/>
			</article>
			<slot name="crossIcon">
				{#if inputVal && inputVal.length}
					<Button variant="transparent" class="!pr-0" size="xs" onClick={resetData}>
						<CrossIcon class="mx-4 cursor-pointer" />
					</Button>
				{/if}
			</slot>
		</div>
		<!-- Results Section -->
		{#if showResults}
			<slot name="resultSection">
				<section class="w-full lg:w-[440px] {parentResultClass}">
					<!-- Results Data (List) Div -->
					{#if results || initialSearchResult}
						<slot name="resultsData">
							<section>
								{#each results || [] as item, index (item)}
									<div
										class="cursor-pointer border-b border-border p-2 text-left"
										class:border-none={index === results?.length - 1}
										on:keydown={() => handleResultItemClick(item, index)}
										on:click={() => handleResultItemClick(item, index)}
									>
										{item?.schemeName || '-'}
									</div>
								{/each}
							</section>
						</slot>
					{:else}
						<slot name="defaultResult">
							<div class="border-gray-600 p-2 text-left">
								<p>No Results Found.</p>
							</div>
						</slot>
					{/if}

					<!-- Default Result Option -->
				</section>
			</slot>
		{/if}
	</section>
</article>
