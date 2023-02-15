<script>
	import HoldingCard from '$lib/components/Holdings/HoldingCard.svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import { onMount } from 'svelte';

	onMount(() => {
		useFetch('https://jsonplaceholder.typicode.com/users').then((/** @type {any} */ res) => {
			console.log(res);
		});
	});
</script>

<HoldingCard />
̦
