<script lang="ts">
	import PendingActionsLoader from './components/PendingActionsLoader.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import SomethingWentWrong from '$components/Error/SomethingWentWrong.svelte';
	import ActionsDashboard from './components/ActionsDashboard.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	export let data: PageData;

	const scrollToTop = () => {
		document?.getElementsByTagName?.('main')?.[0]?.scrollTo(0, 0);
	};

	onMount(() => {
		scrollToTop();
	});
</script>

<article>
	<section class="mt-0 pb-8">
		<header class="hidden sm:block">
			<PageTitle title="Pending Actions" class="mb-0 sm:mb-4 sm:flex" />
		</header>
		{#await data?.api?.getPendingActionsData}
			<PendingActionsLoader />
		{:then pendingActionsData}
			{#if pendingActionsData instanceof Error}
				<SomethingWentWrong />
			{:else if pendingActionsData}
				<ActionsDashboard actionsData={pendingActionsData} />
			{/if}
		{/await}
	</section>
</article>
