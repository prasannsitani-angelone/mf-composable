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
			<SearchComponent
				id="header-search"
				class="rounded-t-md bg-background-alt"
				searchPageLoaded={pageLoaded}
				filter="divedendgrowthflag:GROWTH&recommendation=true"
				autoFocus={false}
			/>
		</div>
	</section>
</article>
