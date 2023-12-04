<script lang="ts">
	import Button from '$components/Button.svelte';
	import type { ITab } from '$lib/types/ITab';
	const activeTabClass =
		'border-b-[3px] rounded-none text-blue-primary pb-4 border-blue-primary hover:border-blue-primary';
	const inactiveTabClass =
		'text-grey-body rounded-none  pb-4 border-b-[3px]  border-grey-line border-b-[3px] hover:border-grey-line';
	let activeTab: string;
	let tabs: ITab[];

	export { activeTab, tabs };
</script>

<section class="relative left-0 z-10 w-full overflow-hidden border-b bg-grey {$$props.class || ''}">
	<article
		class="flex w-full items-center justify-between rounded-t-lg bg-white pt-4 text-center text-sm font-medium"
	>
		{#each tabs as tab}
			<Button
				variant="transparent"
				class={`w-[46%] flex-[50%] !px-0 !pt-0 !font-normal md:w-auto md:min-w-[80px]  ${
					activeTab?.toLowerCase() === tab.name?.toLowerCase() ? activeTabClass : inactiveTabClass
				}`}
				onClick={tab.onClick}
			>
				{tab.name}
			</Button>
		{/each}
	</article>
</section>
