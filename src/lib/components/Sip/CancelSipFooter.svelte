<script>
	import { Button } from 'svelte-components';
	import { createEventDispatcher } from 'svelte';

	export let selectedReason = '';

	const dispatch = createEventDispatcher();

	const cancelSipClicked = () => {
		dispatch('cancelSipButtonClick');
	};

	const stayInvestedClicked = () => {
		dispatch('stayInvestedButtonClick');
	};
</script>

<!--Footer-->
<article
	class="fixed inset-0 top-auto z-20 bg-background-alt px-4 py-3 md:relative md:inset-auto md:top-auto md:mt-2 md:p-0"
>
	<section class="flex items-center justify-around">
		<Button
			class="flex-1 rounded text-sm font-medium"
			onClick={stayInvestedClicked}
			variant="outlined"
		>
			STAY INVESTED
		</Button>

		<div class="w-4" />

		<Button
			class="!disabled:text-disabled flex-1 rounded text-sm font-medium disabled:border-disabled disabled:!bg-background-alt"
			onClick={cancelSipClicked}
			variant="outlined"
			disabled={!selectedReason?.length}
		>
			CANCEL SIP
		</Button>
	</section>
</article>
