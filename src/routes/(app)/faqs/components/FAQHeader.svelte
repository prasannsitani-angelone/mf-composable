<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	let handleBackNavigation: (() => void) | null = null;
	let title = '';
	export { handleBackNavigation, title };
</script>

<section
	class={`z-[70] flex-shrink-0 bg-background-alt p-2 pl-4 text-center shadow-csm md:rounded-t-lg md:px-5 md:py-4 ${$$props?.class}`}
>
	<article class="flex flex-col items-center justify-around py-[6px]">
		<article class="flex w-full items-center justify-between">
			<article class="flex items-center justify-start">
				<WMSIcon
					name="left-arrow"
					stroke="var(--TITLE)"
					class="mr-4 cursor-pointer"
					height={16}
					width={16}
					on:click={handleBackNavigation}
				/>
				<h1 class="text-lg font-normal text-title">
					<div class="truncate text-left {!title && 'h-7'}">
						{title || ''}
					</div>
				</h1>
			</article>
		</article>
	</article>
</section>
