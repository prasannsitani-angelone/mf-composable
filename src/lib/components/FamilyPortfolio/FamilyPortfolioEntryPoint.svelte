<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { WMSIcon } from 'svelte-components';
	import DownArrowLargeIcon from '$lib/images/icons/DownArrowLargeIcon.svelte';
	import { familyStore } from '$lib/stores/FamilyStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { appStore } from '$lib/stores/SparkStore';
	import { onMount } from 'svelte';
	import { familyPortfolioEntryPointClickAnalytics } from '$lib/analytics/familyPortfolio/familyPortfolio';

	let entryPointInterval: ReturnType<typeof setInterval>;
	let selfClientCode = $profileStore?.clientId;
	let familyMembersList = familyStore?.getFamilyMembersDetails() || [];
	let isFamilyPortfolio = appStore?.isFamilyPortfolioSelected(selfClientCode);
	let isLoaded = false;

	const setEntryPointData = () => {
		selfClientCode = $profileStore?.clientId;
		familyMembersList = familyStore?.getFamilyMembersDetails() || [];
		isFamilyPortfolio = appStore?.isFamilyPortfolioSelected(selfClientCode);
		isLoaded = true;
	};

	setEntryPointData();

	onMount(() => {
		if (!familyMembersList?.length) {
			entryPointInterval = setInterval(() => {
				setEntryPointData();

				if (familyMembersList?.length) {
					clearInterval(entryPointInterval);
				}
			}, 100);
		}

		return () => {
			if (entryPointInterval !== undefined) {
				clearInterval(entryPointInterval);
			}
		};
	});

	const redirectToFamilyPage = () => {
		goto(`${base}/investments/family`);

		familyPortfolioEntryPointClickAnalytics();
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if isLoaded && familyMembersList?.length > 1}
	<section
		class="flex items-center rounded-2xl bg-background-alt px-2 py-1 text-sm font-normal text-title md:cursor-pointer {isFamilyPortfolio
			? 'md:w-[106px]'
			: 'md:w-[90px]'} {$$props?.class || ''}"
		on:click={redirectToFamilyPage}
	>
		<WMSIcon name={isFamilyPortfolio ? 'family' : 'profile'} stroke="var(--TITLE)" />
		<div class="ml-0.5 text-title">{isFamilyPortfolio ? 'Family' : 'You'}</div>
		<DownArrowLargeIcon class="ml-1 w-5 px-1" stroke="var(--TITLE)" />
	</section>
{/if}
