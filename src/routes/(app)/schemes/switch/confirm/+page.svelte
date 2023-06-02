<script lang="ts">
	import { SEO } from 'wms-ui-component';
	import SwitchConfirmation from './SwitchConfirmation/SwitchConfirmation.svelte';
	import type { PageData } from './[scheme_name]/$types';
	export let data: PageData;
</script>

<SEO
	seoTitle={`${data?.folioHolding?.schemeName} - Switch Funds | Angel One`}
	seoDescription={`${data?.folioHolding?.schemeName} - Switch Funds | Angel One`}
/>
<SwitchConfirmation
	folioHolding={data?.folioHolding}
	folioList={data?.folioList}
	numberOfUnits={data?.numberOfUnits}
	amount={data?.amount}
	selectedFolio={data?.selectedFolio}
	switchInFund={data?.switchInFund}
	fullAmountSelected={data?.fullAmountSelected}
/>
