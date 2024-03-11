<script>
	import { base } from '$app/paths';
	import { getQueryParamsObj } from '$lib/utils/helpers/params';
	import { onMount } from 'svelte';

	const defaultFundId = '101'; // This is the default fund ID.

	onMount(() => {
		const queryParamsObj = getQueryParamsObj();
		const { id = defaultFundId } = queryParamsObj;
		const redirectUrl = `${window.location.origin}${base}/categories?id=${id}`;
		window.location.replace(redirectUrl);
	});
</script>
