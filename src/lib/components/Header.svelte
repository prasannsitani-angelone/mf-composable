<script lang="ts">
	import SearchDarkIcon from '$lib/images/icons/SearchDarkIcon.svelte';
	import CrossIcon from '$lib/images/icons/CrossIcon.svelte';
	import { appStore } from '$lib/stores/SparkStore';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import DesktopHeader from './DesktopHeader.svelte';
	import { userStore } from '$lib/stores/UserStore';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	$: pageMetaData = $page?.data?.layoutConfig;
</script>

{#if $page?.data?.deviceType?.isMobile}
	<section class="p-2 pl-4 text-center md:p-5">
		<article class="flex flex-col items-center justify-around py-[6px] md:hidden">
			<section class="flex w-full items-center justify-between">
				<article>
					<div class="cursor-pointer">
						<article class="flex items-center justify-start">
							{#if pageMetaData?.showBackIcon}
								<LeftArrowIcon class="mr-4 cursor-pointer" onClick={() => history.back()} />
							{/if}
							{#if pageMetaData?.showCloseIcon && (($appStore.isSparkAndroidUser && $appStore.closecta) || $appStore.isSparkIOSUser)}
								<CrossIcon class="mr-4 cursor-pointer" />
							{/if}
							{#if pageMetaData?.title === 'Mutual Funds'}
								<img
									src="/images/mutual-fund-logo.webp"
									alt="Angel one Logo"
									width="32"
									height="32"
									class="mr-1 h-8 w-8"
								/>
							{/if}
							<h1 class="text-lg font-medium text-black-title">
								{#if userStore.userType() === 'B2C' && pageMetaData?.title === 'Mutual Funds'}
									<span class="ml-1 flex flex-col">
										<span> Direct Mutual Funds v2 </span>
										<span class="text-left text-xs text-grey-body">Zero commission | Zero fees</span
										>
									</span>
								{:else}
									<div class="truncate text-left" class:w-80={!pageMetaData?.showSearchIcon}>
										{pageMetaData?.title || ''}
									</div>
								{/if}
							</h1>
						</article>
					</div>
				</article>
				{#if pageMetaData?.showSearchIcon}
					<article class="flex pr-4">
						<a href={`${base}/search`}>
							<SearchDarkIcon class="ml-2 mt-1 h-6 w-6 cursor-pointer" />
						</a>
					</article>
				{/if}
			</section>
		</article>
	</section>
{:else}
	<DesktopHeader />
{/if}
{#if pageMetaData?.component}
	<svelte:component this={pageMetaData.component} />
{/if}
