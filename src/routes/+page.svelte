<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(`${base}/discoverfunds`);
	});
</script>

<style lang="postcss">
</style>
