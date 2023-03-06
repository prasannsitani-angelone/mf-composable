<script>
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
</script>

{#if browser}
	<Carousel arrows={false} autoplay={true} autoplayDuration={2000}>
		<slot />
	</Carousel>
{/if}


