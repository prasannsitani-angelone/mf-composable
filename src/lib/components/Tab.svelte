<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import type { ITab } from '$lib/types/ITab';
	const activeTabClass =
		'border-b-[3px] rounded-none text-blue-primary pb-5 border-blue-primary hover:border-blue-primary';
	const inactiveTabClass =
		'text-grey-body rounded-none  pb-5 border-b-[3px] border-white hover:!border-transparent';
	let activeTab: string;
	let tabs: ITab[];
	$: deviceType = $page?.data?.deviceType;
	export { activeTab, tabs };
</script>

{#if !deviceType.isBrowser}
	<section class="left-0 w-full border-b bg-grey">
		<article
			class="flex items-center justify-evenly rounded-t-xl bg-white px-6 pt-5 text-center text-sm font-semibold"
		>
			{#each tabs as tab}
				<Button
					variant="transparent"
					class={`w-[46%] !pt-0  ${activeTab === tab.name ? activeTabClass : inactiveTabClass}`}
					onClick={tab.onClick}
				>
					{tab.name}
				</Button>
			{/each}
		</article>
	</section>
{/if}
