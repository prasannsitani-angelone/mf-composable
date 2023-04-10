<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { update } from '$lib/utils/helpers/hydrated';

	onMount(() => {
		update();
	});
</script>

<slot />
