<script>
	import Link from '../Link.svelte';
	import Table from '../Table.svelte';

	let tableData;

	export { tableData };
</script>

<section class="mt-2 max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-4">
	<header class="flex flex-col p-6">
		<h2 class="text-lg font-medium text-black-title">Popular With Other Investors</h2>
	</header>
	<Table {tableData} />
</section>
