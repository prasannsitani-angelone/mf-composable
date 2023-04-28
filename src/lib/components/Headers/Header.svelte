<script lang="ts">
	import MobileHeader from './MobileHeader.svelte';
	import DesktopHeader from './DesktopHeader.svelte';
	import { userStore } from '$lib/stores/UserStore';
	import { page } from '$app/stores';
	import { headerStore } from '$lib/stores/HeaderStore';
	$: pageMetaData = $page?.data?.layoutConfig;
</script>

{#if $page?.data?.deviceType?.isMobile}
	{#if $headerStore?.showMobileHeader}
		<MobileHeader
			title={pageMetaData?.title}
			showSearchIcon={pageMetaData?.showSearchIcon}
			showBackIcon={pageMetaData?.showBackIcon}
			showCloseIcon={pageMetaData?.showCloseIcon}
			class="bg-white"
		>
			<svelte:fragment slot="title">
				<h1 class="text-lg font-medium text-black-title">
					{#if userStore.userType() === 'B2C' && pageMetaData?.title === 'Mutual Funds'}
						<span class="ml-1 flex flex-col">
							<span> Direct Mutual Funds v2 </span>
							<span class="text-left text-xs text-grey-body">Zero commission | Zero fees</span>
						</span>
					{:else}
						<div class="truncate text-left" class:w-80={!pageMetaData?.showSearchIcon}>
							{pageMetaData?.title || ''}
						</div>
					{/if}
				</h1>
			</svelte:fragment>
		</MobileHeader>
	{/if}
{:else}
	<DesktopHeader />
{/if}
{#if pageMetaData?.component}
	<svelte:component this={pageMetaData.component} />
{/if}
