<script lang="ts">
	import type { PageData } from './$types';
	import FundOverview from './FundOverview/FundOverview.svelte';

	export let data: PageData;
</script>

<FundOverview schemeDetails={data?.schemeData} />
