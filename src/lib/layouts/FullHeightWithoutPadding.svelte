<script lang="ts">
	import Header from '$components/Header.svelte';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	const appContext: AppContext = getContext('app');
</script>

<div class="flex-no-wrap fixed flex h-full w-full flex-col bg-grey">
	<header class="relative flex-shrink-0 bg-white">
		<Header />
	</header>
	<main class="scroll-lock w-full flex-grow overflow-auto">
		<section class="m-auto flex h-full max-w-8xl flex-wrap justify-center">
			<section class={`h-full w-full lg:pt-3 xl:w-4/5`}>
				<slot />
			</section>
		</section>
	</main>
</div>
