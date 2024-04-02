<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import KycPending from '$lib/images/kycPending.svelte';
	import { WMSIcon } from 'svelte-components';
	import { PUBLIC_KYC_DEEPLINK_URL } from '$env/static/public';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { appStore } from '$lib/stores/SparkStore';
	import { goBackToSpark } from '$lib/utils';
	import {
		handleClickViewKycAnalytics,
		handleGoBackButtonAnalytics,
		handleIncompleteKycImpression
	} from './analytics';

	let shouldLoadButtons = false;
	const source = $page.url.searchParams.get('source');

	const navigateToKycPage = () => {
		if (!shouldLoadButtons) return;
		handleClickViewKycAnalytics({
			source
		});
		window.open(`${PUBLIC_KYC_DEEPLINK_URL}?gt=${$page.data.token}`, '_blank');
	};

	const navigateToHomePage = async () => {
		if (!shouldLoadButtons) return;
		handleGoBackButtonAnalytics({
			source
		});
		if ($appStore.openViaTabView || appStore.isMFTabAvailable()) {
			goBackToSpark();
		} else {
			await goto(`${base}/discoverfunds`, { replaceState: true });
		}
	};

	onMount(() => {
		setTimeout(() => {
			shouldLoadButtons = true;
			handleIncompleteKycImpression({
				source
			});
		}, 100);
	});
</script>

<article data-testid="incomplete-kyc">
	<div class="absolute inset-0 flex flex-col items-center justify-center">
		<KycPending />
		<h2 class="mt-6 text-[18px] font-medium text-title">KYC Not Complete</h2>
		<p class="w-3/4 text-center text-[14px] text-body">
			Complete your KYC process to invest in mutual funds
		</p>
	</div>
	{#if shouldLoadButtons}
		<div class="container absolute bottom-0 mb-3 flex flex-col items-center justify-center">
			<Button
				variant="contained"
				class="{$$props.class} w-full"
				ariaLabel="View KYC status"
				onClick={navigateToKycPage}
			>
				VIEW KYC STATUS
				<WMSIcon name="right-arrow" size="xs" class="ml-2" stroke="var(--BACKGROUND-ALT)" />
			</Button>
			<Button
				variant="transparent"
				class="{$$props.class} mt-2 w-full"
				onClick={navigateToHomePage}
			>
				GO BACK
			</Button>
		</div>
	{/if}
</article>

<style>
	.container {
		width: calc(100% - 16px);
	}
</style>
