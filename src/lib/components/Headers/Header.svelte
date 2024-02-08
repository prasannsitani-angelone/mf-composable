<script lang="ts">
	import MobileHeader from './MobileHeader.svelte';
	import DesktopHeader from './DesktopHeader.svelte';
	import { page } from '$app/stores';
	import { headerStore } from '$lib/stores/HeaderStore';
	import { createEventDispatcher, onMount } from 'svelte';
	import NxtHeader from './NxtHeader.svelte';
	import FamilyPortfolioEntryPoint from '$components/FamilyPortfolio/FamilyPortfolioEntryPoint.svelte';
	import FamilyPortfolioInfo from '$components/FamilyPortfolio/FamilyPortfolioInfo.svelte';
	$: pageMetaData = $page?.data?.layoutConfig;
	$: userType = $page?.data?.userDetails?.userType || 'B2C';
	const dispatch = createEventDispatcher();
	const handleSearchFocusEvent = (e: { detail: boolean }) => {
		dispatch('handleSearchFocus', e.detail);
	};

	let cookieEnabled = true;
	let isNxtPage = $page?.route?.id?.search('/nxt') !== -1;

	onMount(() => {
		cookieEnabled = navigator?.cookieEnabled;
	});
</script>

{#if isNxtPage}
	<NxtHeader />
{:else if $page?.data?.deviceType?.isMobile || $page?.data?.deviceType?.isTablet}
	{#if !pageMetaData.hideMobileHeader}
		{#if $headerStore?.showMobileHeader}
			<MobileHeader
				title={pageMetaData?.title}
				titleClass={pageMetaData?.titleClass}
				showSearchIcon={pageMetaData?.showSearchIcon}
				showBackIcon={pageMetaData?.showBackIcon}
				showCloseIcon={pageMetaData?.showCloseIcon}
				showShareIcon={pageMetaData?.showShareIcon}
				showCartIcon={pageMetaData?.showCartIcon}
				showFaqIcon={pageMetaData?.showFaqIcon}
				showThreeDotsIcon={pageMetaData?.showThreeDotsIcon}
				faqParams={pageMetaData?.faqParams}
				faqIconStroke={pageMetaData?.faqIconStroke}
				onClickShareIcon={pageMetaData?.onClickShareIcon}
				onThreeDotsClick={pageMetaData?.onThreeDotsClick}
				onClickFaqsIcon={pageMetaData?.onClickFaqsIcon}
				class={pageMetaData?.headerClass || ''}
			>
				<svelte:fragment slot="title">
					<h1 class="text-lg font-medium text-title {pageMetaData?.titleClass || ''}">
						{#if userType === 'B2C' && pageMetaData?.title === 'Mutual Funds'}
							<span class="ml-1 flex flex-col">
								<span class="flex"> Direct Mutual Funds</span>
								<span class="text-left text-xs font-normal text-body"
									>Zero commission | Zero fees</span
								>
							</span>
						{:else}
							<div class="flex truncate text-left">
								{pageMetaData?.title || ''}
							</div>
						{/if}
					</h1>
				</svelte:fragment>

				<svelte:fragment slot="additionalSection">
					{#if pageMetaData?.title === 'Portfolio'}
						<section class="ml-2">
							<FamilyPortfolioEntryPoint />
						</section>
					{/if}
					{#if pageMetaData?.title === 'Family Portfolio'}
						<section class="ml-1">
							<FamilyPortfolioInfo />
						</section>
					{/if}
				</svelte:fragment>
			</MobileHeader>
		{/if}
	{/if}
{:else}
	<DesktopHeader on:handleSearchFocus={handleSearchFocusEvent} />
{/if}
{#if pageMetaData?.component}
	<svelte:component this={pageMetaData.component} />
{/if}
{#if !cookieEnabled}
	<div class="bg-secondary px-4 py-2 text-lg font-normal text-title">
		Enable your browser cookies to enjoy a seamless experience in investing in Mutual Funds.
	</div>
{/if}
<noscript>
	<div class="bg-secondary px-4 py-2 text-lg font-normal text-title">
		Enable Javascript in your Chrome Settings to enjoy a seamless experience in investing in Mutual
		Funds.
	</div>
</noscript>
