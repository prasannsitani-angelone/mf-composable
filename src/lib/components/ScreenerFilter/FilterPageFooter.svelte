<script>
	import { BtnVariant, Button } from 'svelte-components';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const applyFiltersClicked = () => {
		dispatch('applyFiltersClick');
	};

	const resetFiltersClicked = () => {
		dispatch('resetFilterClick');
	};
</script>

<!--Footer-->
<article
	class="fixed inset-0 top-auto z-20 bg-background-alt px-4 py-3 md:relative md:inset-auto md:top-auto md:mt-2 md:p-0 {$$props?.class ||
		''}"
>
	<section class="flex items-center justify-around">
		<Button
			class="flex-1 rounded text-sm font-medium"
			onClick={resetFiltersClicked}
			variant={BtnVariant?.Outlined}
		>
			RESET
		</Button>

		<div class="w-4" />

		<Button
			class="!disabled:text-disabled flex-1 rounded text-sm font-medium disabled:border-disabled disabled:!bg-background-alt"
			onClick={applyFiltersClicked}
			variant={BtnVariant?.Contained}
		>
			APPLY FILTERS
		</Button>
	</section>
</article>
