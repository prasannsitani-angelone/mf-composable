<script>
	import { base } from '$app/paths';
	import { modifiedGoto } from '$lib/utils/goto';
	import { getQueryParamsObj } from '$lib/utils/helpers/params';
	import { onMount } from 'svelte';

	const defaultFundId = '101'; // This is the default fund ID.

	onMount(() => {
		const queryParamsObj = getQueryParamsObj();
		const { id = defaultFundId } = queryParamsObj;
		const replaceState = true;
		modifiedGoto(`${base}/categories?id=${id}`, { replaceState });
	});
</script>
