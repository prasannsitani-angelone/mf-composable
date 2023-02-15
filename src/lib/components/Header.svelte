<script lang="ts">
	import DeviceDetector from 'svelte-device-detector';
	import { page } from '$lib/stores/PageStore.js';
	import SearchDarkIcon from '$lib/images/icons/SearchDarkIcon.svelte';
	import CrossIcon from '$lib/images/icons/CrossIcon.svelte';
	import { appStore } from '$lib/stores/SparkStore';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
</script>

<section class="p-2 pl-4 text-center md:p-5">
	<DeviceDetector showInDevice="mobile">
		<article class="flex flex-col items-center justify-around py-[6px] md:hidden">
			<section class="flex w-full items-center justify-between">
				<article>
					<div class="cursor-pointer">
						<article class="flex items-center justify-start">
							{#if $page.showBackIcon}
								<LeftArrowIcon class="mr-4 cursor-pointer" onClick={() => history.back()} />
							{/if}
							{#if (appStore.isSparkAndroidUser() || appStore.isSparkIOSUser()) && !$page.showBackIcon}
								<CrossIcon class="mr-4 cursor-pointer" />
							{/if}
							<img
								src="/images/mutual-fund-logo.webp"
								alt="Angel one Logo"
								width="32"
								height="32"
								class="mr-1 h-8 w-8"
							/>
							<h1 class="text-lg font-medium text-black-title">
								<span class="ml-1 flex flex-col">
									<span>{$page.title}</span>
								</span>
							</h1>
						</article>
					</div>
				</article>
				{#if $page.showSearchIcon}
					<article class="flex pr-4">
						<a href="/search">
							<SearchDarkIcon class="ml-2 mt-1 h-6 w-6 cursor-pointer" />
						</a>
					</article>
				{/if}
			</section>
		</article>
	</DeviceDetector>
</section>
