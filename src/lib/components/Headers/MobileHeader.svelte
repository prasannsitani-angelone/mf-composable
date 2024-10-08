<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { appStore } from '$lib/stores/SparkStore';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import Link from '$components/Link.svelte';
	import AddToCart from '$components/AddToCart.svelte';
	import { crossButtonClickEvent } from '$components/Headers/analytics';
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { browserHistoryStore } from '$lib/stores/BrowserHistoryStore';
	import { goBackToSpark } from '$lib/utils';

	export let title = '';
	export let showSearchIcon = false;
	export let showBackIcon = false;
	export let closeAppOnBackPress = false;
	export let showShareIcon = false;
	export let showCartIcon = false;
	export let showFaqIcon = false;
	export let showRightIcon = false;
	export let faqParams = '';
	export let titleClass = '';
	export let showThreeDotsIcon = false;
	export let onClickShareIcon: (() => void) | null = null;
	export let onThreeDotsClick: (() => void) | null = null;
	export let onClickFaqsIcon: (() => void) | null = null;

	const dispatch = createEventDispatcher();

	const handleCloseButtonClick = () => {
		crossButtonClickEvent();
		goBackToSpark();
	};

	const handleBackNavigation = async () => {
		dispatch('backButtonClick');
		history.back();
	};

	const handleBackButtonClick = () => {
		if (
			(closeAppOnBackPress ||
				$browserHistoryStore.historyLength === 1 ||
				$browserHistoryStore.initialUrl === `${$page.url.origin}${$page.url.pathname}`) &&
			(($appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_ANDROID && $appStore.closecta) ||
				$appStore.platform.toLowerCase() === PLATFORM_TYPE.SPARK_IOS)
		) {
			handleCloseButtonClick();
		} else {
			handleBackNavigation();
		}
	};

	const logoUrl = `${base}/images/mutual-fund-logo.webp`;
</script>

<section class={`p-2 pl-4 text-center md:p-5 ${$$props?.class}`}>
	<article
		class="flex cursor-pointer flex-col items-center justify-around py-[6px] md:hidden {$$props?.class2}"
	>
		<article class="flex w-full items-center justify-between">
			<article class="flex items-center justify-start">
				<slot name="icon">
					{#if showBackIcon}
						<LeftArrowIcon class="mr-4 cursor-pointer" onClick={handleBackButtonClick} />
					{/if}
				</slot>

				{#if title === 'Mutual Funds'}
					<img src={logoUrl} alt="Angel One Logo" width="32" height="32" class="mr-1 h-8 w-8" />
				{/if}
				<article class="flex items-center">
					<slot name="title">
						<h1 class="text-lg font-normal text-title {titleClass || ''}">
							<div
								class="truncate text-left"
								class:w-80={!showSearchIcon && !showShareIcon && !showFaqIcon && !showRightIcon}
							>
								{title || ''}
							</div>
						</h1>
					</slot>
					<slot name="additionalSection" />
				</article>
			</article>
			<div class="flex items-center justify-end">
				<slot name="cartIcon">
					{#if showCartIcon}
						<article id="cart-icon" class="flex justify-end">
							{#await $page.data?.api?.schemeData then schemeData}
								{#if schemeData?.nfoScheme === 'N'}
									<AddToCart
										scheme={schemeData}
										class="h-fit min-h-fit px-0"
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
							<WMSIcon
								name="share"
								stroke="var(--TITLE)"
								on:click={onClickShareIcon}
								height={24}
								width={24}
							/>
						</article>
					{/if}
				</slot>
				<slot name="searchIcon">
					{#if showSearchIcon}
						<article class="flex pr-4">
							<Link to={`/search`} ariaLabel="search">
								<WMSIcon
									name="search-dark"
									class="ml-2 mt-1 h-6 w-6 cursor-pointer"
									stroke="var(--TITLE)"
								/>
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
									stroke="var(--PRIMARY)"
									height={24}
									width={24}
									class="p-0.5"
									on:click={onClickFaqsIcon}
								/>
							</Link>
						</article>
					{/if}
				</slot>
				<slot>
					{#if showThreeDotsIcon}
						<article>
							<Button class="border-none !bg-background-alt px-3" onClick={onThreeDotsClick}>
								<WMSIcon name="three-vertical-dots-icon" height={15} />
							</Button>
						</article>
					{/if}
				</slot>
				<slot name="rightIcon" />
			</div>
		</article>
	</article>
</section>
