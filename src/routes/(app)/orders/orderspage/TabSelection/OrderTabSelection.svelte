<script>
	import TabSelection from './TabSelection.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	const handleTabSelection = () => {
		goto(`${base}/orders/orderspage/sipbook`, { replaceState: true });
	};
</script>

<TabSelection activeTab="ORDERS" {handleTabSelection} />
