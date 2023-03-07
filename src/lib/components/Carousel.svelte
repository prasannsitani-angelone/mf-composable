<script>
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
</script>

{#if browser}
	<Carousel arrows={false} autoplay={true} pauseOnFocus={true}  autoplayDuration={2000}>
		<slot />
	</Carousel>
{:else}
      <slot />
{/if}


