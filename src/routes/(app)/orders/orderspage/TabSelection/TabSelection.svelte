<script lang="ts">
	import Button from '$components/Button.svelte';
	const activeTabClass = 'border-b-[3px] rounded-none text-blue-primary pb-5 border-blue-primary';
	const inactiveTabClass = 'text-grey-body rounded-none  pb-5 border-b-[3px] border-white';
	let handleTabSelection: (tab: string) => void;
	let activeTab: string;
	export { handleTabSelection, activeTab };
</script>

<section class="fixed top-[3.5rem] left-0 w-full border-b">
	<article
		class="flex items-center justify-evenly bg-white px-6 pt-5 text-center text-sm font-semibold"
	>
		<Button
			variant="transparent"
			class={`!px-0 !pt-0 ${activeTab === 'ORDERS' ? activeTabClass : inactiveTabClass}`}
			onClick={() => handleTabSelection('ORDERS')}
		>
			Orders
		</Button>

		<Button
			variant="transparent"
			class={`!px-0 !pt-0 ${activeTab === 'SIPBOOK' ? activeTabClass : inactiveTabClass}`}
			onClick={() => handleTabSelection('SIPBOOK')}
		>
			SIPs
		</Button>
	</article>
</section>
