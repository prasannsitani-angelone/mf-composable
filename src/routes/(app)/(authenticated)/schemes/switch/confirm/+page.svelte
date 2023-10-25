<script lang="ts">
	import { SEO } from 'svelte-components';
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
	folioListLength={data?.folioListLength}
	numberOfUnits={data?.numberOfUnits}
	amount={data?.amount}
	selectedFolio={data?.selectedFolio}
	switchInFund={data?.switchInFund}
	fullAmountSelected={data?.fullAmountSelected}
	appsource={data?.appsource}
	requestId={data?.requestId}
	interAmcFlag={data?.interAmcFlag}
	bankAccountNo={data?.bankAccountNo}
	bankName={data?.bankName}
	mandateDetails={data?.mandateDetails}
/>
