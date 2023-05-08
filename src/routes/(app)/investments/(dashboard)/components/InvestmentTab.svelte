<script lang="ts">
	import Button from '$components/Button.svelte';
	import type { ITab } from '$lib/types/ITab';
	const activeTabClass =
		'border-b-[3px] rounded-none text-blue-primary pb-4 border-blue-primary hover:border-blue-primary';
	const inactiveTabClass =
		'text-grey-body rounded-none  pb-4 border-b-[3px] border-white hover:!border-transparent';
	let activeTab: string;
	let tabs: ITab[];

	export { activeTab, tabs };
</script>

<section
	class="relative left-0 z-10 w-full overflow-hidden border-b max-sm:-mt-2 max-sm:ml-[calc(50%-50vw)] max-sm:mb-2 max-sm:w-screen sm:rounded-t-lg"
>
	<article
		class="flex items-center justify-evenly bg-white px-6 pt-4 text-center text-sm font-semibold"
	>
		{#each tabs as tab}
			<Button
				variant="transparent"
				class={`min-w-[80px] !px-0 !pt-0  ${
					activeTab?.toLowerCase() === tab.name?.toLowerCase() ? activeTabClass : inactiveTabClass
				}`}
				onClick={tab.onClick}
			>
				{tab.name}
			</Button>
		{/each}
	</article>
</section>
