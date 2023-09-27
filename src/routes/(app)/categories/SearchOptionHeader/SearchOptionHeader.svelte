<script lang="ts">
	import SearchOptionTableHeader from '../SearchOptionTable/SearchOptionTableHeader.svelte';
	import type { CategoryDetailsModalData, CategoryNavItem } from '../types';

	let categoryDetails: CategoryDetailsModalData;
	let pageID: string;
	let categoryFilterOptions: CategoryNavItem[] = [];

	export { categoryDetails, pageID, categoryFilterOptions };
</script>

<header
	class="-mt-2 mb-2 ml-[calc(50%-50vw)] w-screen rounded-t-lg bg-white pb-5 sm:ml-0 sm:w-full md:mb-0 lg:px-6"
>
	<SearchOptionTableHeader {categoryDetails} {categoryFilterOptions} {pageID} />
</header>
