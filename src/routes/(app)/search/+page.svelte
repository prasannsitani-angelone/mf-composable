<script>
	import SearchComponent from '$components/Search/SearchComponent.svelte';
	import { onMount } from 'svelte';
	let pageLoaded = false;
	onMount(() => {
		pageLoaded = true;
	});
</script>

<!-- Search Page for Mobile-->
<article>
	<section>
		<div class="w-full origin-top transition duration-100">
			<SearchComponent class="rounded-t-md bg-white" searchPageLoaded={pageLoaded} />
		</div>
	</section>
</article>
