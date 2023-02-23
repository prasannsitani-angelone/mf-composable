<script lang="ts">
	import { base } from '$app/paths';
	import Link from './Link.svelte';

	const logoUrl = `${base}/images/AngelOneLogo.webp`;
</script>

<section class="p-2 pl-4 text-center md:p-5">
	<!-- md and upper (medium and larger) screen layout -->
	<article class="flex-col items-center justify-center gap-10 sm:m-[1px] md:flex md:flex-row">
		<div class="mr-6 cursor-pointer">
			<Link to="/">
				<img src={logoUrl} alt="Angel One Logo" width="127" height="51" />
			</Link>
		</div>
		<Link to="/discoverfunds">
			<div class="hidden cursor-pointer uppercase md:block">Discover</div>
		</Link>
		<Link to="/investments">
			<div class="mr-4 hidden cursor-pointer uppercase md:block">INVESTMENTS</div>
		</Link>
		<div class="w-full md:w-2/5" />
	</article>
</section>
