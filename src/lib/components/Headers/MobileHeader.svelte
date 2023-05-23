<script lang="ts">
	import { base } from '$app/paths';
	import { appStore } from '$lib/stores/SparkStore';
	import SearchDarkIcon from '$lib/images/icons/SearchDarkIcon.svelte';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import CrossIcon from '$lib/images/icons/CrossIcon.svelte';
	import { PLATFORM_TYPE } from '$lib/constants/platform';

	export let title = '';
	export let showSearchIcon = false;
	export let showBackIcon = false;
	export let showCloseIcon = false;

	const logoUrl = `${base}/images/mutual-fund-logo.webp`;
</script>

<section class={`p-2 pl-4 text-center shadow-csm md:p-5 ${$$props?.class}`}>
	<article class="flex flex-col items-center justify-around py-[6px] md:hidden">
		<article class="flex w-full cursor-pointer items-center justify-between">
			<article class="flex items-center justify-start">
				<slot name="icon">
					{#if showBackIcon}
						<LeftArrowIcon class="mr-4 cursor-pointer" onClick={() => history.back()} />
					{/if}
					{#if showCloseIcon && (($appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID && $appStore.closecta) || $appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS)}
						<CrossIcon class="mr-4 cursor-pointer" />
					{/if}
				</slot>

				{#if title === 'Mutual Funds'}
					<img src={logoUrl} alt="Angel one Logo" width="32" height="32" class="mr-1 h-8 w-8" />
				{/if}
				<slot name="title">
					<h1 class="text-lg font-medium text-black-title">
						<div class="truncate text-left" class:w-80={!showSearchIcon}>
							{title || ''}
						</div>
					</h1>
				</slot>
			</article>
			<slot name="searchIcon">
				{#if showSearchIcon}
					<article class="flex pr-4">
						<a href={`${base}/search`}>
							<SearchDarkIcon class="ml-2 mt-1 h-6 w-6 cursor-pointer" />
						</a>
					</article>
				{/if}
			</slot>
		</article>
	</article>
</section>
