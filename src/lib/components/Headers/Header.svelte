<script lang="ts">
	import MobileHeader from './MobileHeader.svelte';
	import DesktopHeader from './DesktopHeader.svelte';
	import { page } from '$app/stores';
	import { headerStore } from '$lib/stores/HeaderStore';
	import { createEventDispatcher } from 'svelte';
	$: pageMetaData = $page?.data?.layoutConfig;
	$: userType = $page?.data?.userDetails?.userType || 'B2C';
	const dispatch = createEventDispatcher();
	const handleSearchFocusEvent = (e: { detail: boolean }) => {
		dispatch('handleSearchFocus', e.detail);
	};
</script>

{#if $page?.data?.deviceType?.isMobile}
	{#if $headerStore?.showMobileHeader}
		<MobileHeader
			title={pageMetaData?.title}
			showSearchIcon={pageMetaData?.showSearchIcon}
			showBackIcon={pageMetaData?.showBackIcon}
			showCloseIcon={pageMetaData?.showCloseIcon}
			showShareIcon={pageMetaData?.showShareIcon}
			onClickShareIcon={pageMetaData?.onClickShareIcon}
			class="bg-white"
		>
			<svelte:fragment slot="title">
				<h1 class="text-lg font-medium text-black-title">
					{#if userType === 'B2C' && pageMetaData?.title === 'Mutual Funds'}
						<span class="ml-1 flex flex-col">
							<span class="flex"> Direct Mutual Funds</span>
							<span class="text-left text-xs text-grey-body">Zero commission | Zero fees</span>
						</span>
					{:else}
						<div
							class="flex truncate text-left"
							class:w-80={!pageMetaData?.showSearchIcon && !pageMetaData?.showShareIcon}
						>
							{pageMetaData?.title || ''}
						</div>
					{/if}
				</h1>
			</svelte:fragment>
		</MobileHeader>
	{/if}
{:else}
	<DesktopHeader on:handleSearchFocus={handleSearchFocusEvent} />
{/if}
{#if pageMetaData?.component}
	<svelte:component this={pageMetaData.component} />
{/if}
