<script lang="ts">
	import Button from '$components/Button.svelte';
	import type { ISearchHeaderProps } from '$lib/types/ISearch';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let data: ISearchHeaderProps;

	const handleClearAllClick = () => {
		dispatch('clearAll');
	};
	export { data };
</script>

<article>
	<slot name="searchHeader">
		<section class="flex items-center justify-between p-4">
			<slot name="searchDefaultTitle">
				<article class="flex items-center">
					<slot name="searchHeaderIconSlot" />

					<h4 class="text-sm font-normal text-body">
						{data?.defaultTitle || ''}
					</h4>
				</article>
			</slot>
			<slot name="searchCtaTitle">
				<article>
					<Button variant="transparent" class="!pr-0" size="xs" onClick={handleClearAllClick}>
						{data?.ctaTitle || ''}
					</Button>
				</article>
			</slot>
		</section>
	</slot>

	<slot name="searchSubHeader">
		<section class="flex items-center justify-between px-4 py-2 pt-0 text-xs lg:pt-2">
			<slot name="subtitleSlot">
				<article>
					<span class="font-normal text-body">
						{data?.subtitle || ''}
					</span>
				</article>
			</slot>
			<slot name="subtitleRightSlot">
				<article>
					<span class="text-body">
						{data?.subtitleRight || ''}
					</span>
				</article>
			</slot>
		</section>
	</slot>
</article>
