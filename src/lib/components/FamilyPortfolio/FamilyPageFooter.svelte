<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button, WMSIcon } from 'svelte-components';

	const dispatch = createEventDispatcher();

	const handleViewHoldingsClick = () => {
		dispatch('viewHoldingsClick');
	};
</script>

<article
	class="fixed inset-0 top-auto z-20 block bg-background-alt p-2 px-4 pt-3 shadow-csm md:static md:inset-auto md:flex md:items-center md:rounded-b-xl md:pb-3"
>
	<section class="flex items-center rounded bg-background p-2 md:h-12 md:flex-1">
		<WMSIcon name="info-in-circle-dark" stroke="var(--TITLE)" class="h-4 w-4" />
		<div class="ml-2 text-xs font-normal text-title">
			You will view holdings of the family members selected above
		</div>
	</section>
	<div class="hidden px-2 md:block" />
	<section class="mt-4 flex items-center md:mt-0 md:flex-1">
		<Button class="w-full" onClick={handleViewHoldingsClick}>View Holdings</Button>
	</section>
</article>
