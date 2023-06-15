<script lang="ts">
	import { page } from '$app/stores';
	import { tabs } from '../../constants';
	import InvestmentTab from './InvestmentTab.svelte';

	let activeTab: string;
	$: activeTab = new Map($page.url.searchParams)?.get('type')?.toLocaleLowerCase() || 'Angel One';
</script>

<div class="block md:hidden">
	<InvestmentTab {activeTab} {tabs} />
</div>
