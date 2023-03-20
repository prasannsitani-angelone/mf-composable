<script lang="ts">
	import { setContext } from 'svelte';
	import type { PageData } from './$types';
	import { SCHEME_DETAILS_KEY } from './constants';
	import FundOverview from './FundOverview/FundOverview.svelte';
	import LockInPeriod from './LockInPeriod.svelte';

	setContext(SCHEME_DETAILS_KEY, {
		getSchemeDetails: () => data.schemeData
	});

	export let data: PageData;
</script>

<FundOverview />
<LockInPeriod />
