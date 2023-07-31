<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { appStore } from '$lib/stores/SparkStore';
	import SearchDarkIcon from '$lib/images/icons/SearchDarkIcon.svelte';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import Link from '$components/Link.svelte';
	import AddToCart from '$components/AddToCart.svelte';
	import { goto } from '$app/navigation';
	import { exitNudgeStore } from '$lib/stores/ExitNudgeStore';
	import { crossButtonClickEvent } from '$components/Headers/analytics';

	export let title = '';
	export let showSearchIcon = false;
	export let showBackIcon = false;
	export let showCloseIcon = false;
	export let showShareIcon = false;
	export let showCartIcon = false;
	export let showFaqIcon = false;
	export let faqParams = '';
	export let titleClass = '';
	export let onClickShareIcon: (() => void) | null = null;

	function overrideCloseButtonClick() {
		const shouldShow = exitNudgeStore.shouldShow();
		if (shouldShow) {
			exitNudgeStore.showNudge();
		}
		return shouldShow;
	}

	const handleCloseButtonClick = () => {
		crossButtonClickEvent();
		if (overrideCloseButtonClick()) {
			return;
		}
		if ($appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS) {
			window.location.href = `${window.location.origin}${base}/exit`;
		} else {
			window.open($appStore.closecta, '_self');
		}
	};

	const handleBackNavigation = async () => {
		if (window.history.length === 1) {
			await goto(`${base}/discoverfunds`);
		} else {
			history.back();
		}
	};

	const logoUrl = `${base}/images/mutual-fund-logo.webp`;
</script>

<section class={`p-2 pl-4 text-center shadow-csm md:p-5 ${$$props?.class}`}>
	<article class="flex flex-col items-center justify-around py-[6px] md:hidden">
		<article class="flex w-full cursor-pointer items-center justify-between">
			<article class="flex items-center justify-start">
				<slot name="icon">
					{#if showBackIcon}
						<LeftArrowIcon class="mr-4 cursor-pointer" onClick={handleBackNavigation} />
					{/if}
					{#if showCloseIcon && (($appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID && $appStore.closecta) || $appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS)}
						<WMSIcon
							height={24}
							width={24}
							name="cross"
							class="mr-4 cursor-pointer"
							on:click={handleCloseButtonClick}
						/>
					{/if}
				</slot>

				{#if title === 'Mutual Funds'}
					<img src={logoUrl} alt="Angel one Logo" width="32" height="32" class="mr-1 h-8 w-8" />
				{/if}
				<slot name="title">
					<h1 class="text-lg font-medium text-black-title {titleClass || ''}">
						<div
							class="truncate text-left"
							class:w-80={!showSearchIcon && !showShareIcon && !showFaqIcon}
						>
							{title || ''}
						</div>
					</h1>
				</slot>
			</article>
			<div class="flex items-center justify-end">
				<slot name="cartIcon">
					{#if showCartIcon}
						<article id="cart-icon" class="flex justify-end">
							{#await $page.data?.api?.schemeData then schemeData}
								{#if schemeData?.nfoScheme === 'N'}
									<AddToCart
										scheme={schemeData}
										class="px-0"
										color="grey"
										entryPoint="FundDetailsPage"
									/>
								{/if}
							{/await}
						</article>
					{/if}
				</slot>
				<slot name="shareIcon">
					{#if showShareIcon}
						<article id="share-icon" class="ml-3 flex">
							<WMSIcon name="share" on:click={onClickShareIcon} height={24} width={24} />
						</article>
					{/if}
				</slot>
				<slot name="searchIcon">
					{#if showSearchIcon}
						<article class="flex pr-4">
							<Link to={`/search`} ariaLabel="search">
								<SearchDarkIcon class="ml-2 mt-1 h-6 w-6 cursor-pointer" />
							</Link>
						</article>
					{/if}
				</slot>
				<slot name="faqIcon">
					{#if showFaqIcon}
						<article class="mr-1">
							<Link to={`/faqs?params=${faqParams}`} ariaLabel="search">
								<WMSIcon
									name="question-mark-point"
									stroke="#2A394E"
									height={24}
									width={24}
									class="p-0.5"
								/>
							</Link>
						</article>
					{/if}
				</slot>
			</div>
		</article>
	</article>
</section>
