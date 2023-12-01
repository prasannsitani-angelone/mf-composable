<script lang="ts">
	import { onDestroy, createEventDispatcher, SvelteComponent } from 'svelte';

	export let threshold = 0;
	export let horizontal = false;
	export let elementScroll: typeof HTMLElement | null;
	export let hasMore = true;

	const dispatch = createEventDispatcher();
	let isLoadMore = false;
	let component: typeof SvelteComponent;

	$: {
		if (component || elementScroll) {
			const element = elementScroll ? elementScroll : component.parentNode;

			element.addEventListener('scroll', onScroll);
			element.addEventListener('resize', onScroll);
		}
	}

	const onScroll = (e) => {
		const offset = horizontal
			? e.target.scrollWidth - e.target.clientWidth - e.target.scrollLeft
			: e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop;

		if (offset <= threshold) {
			if (!isLoadMore && hasMore) {
				dispatch('loadMore');
			}
			isLoadMore = true;
		} else {
			isLoadMore = false;
		}
	};

	onDestroy(() => {
		console.log('Inside onDestroy');
		if (component || elementScroll) {
			console.log('Inside onDestroy condition');

			const element = elementScroll ? elementScroll : component.parentNode;

			element.removeEventListener('scroll', onScroll);
			element.removeEventListener('resize', onScroll);
		}
	});
</script>

<div bind:this={component} style="width:0px" />
