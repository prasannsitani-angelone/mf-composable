<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { WMSIcon } from 'svelte-components';
	import DownArrowLargeIcon from '$lib/images/icons/DownArrowLargeIcon.svelte';
	import { familyStore } from '$lib/stores/FamilyStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { appStore } from '$lib/stores/SparkStore';

	let selfClientCode = $profileStore?.clientId;
	let familyMembersList = familyStore?.getFamilyMembersDetails() || [];
	let isFamilyPortfolio = appStore?.isFamilyPortfolioSelected(selfClientCode);
	let isLoaded = false;

	setTimeout(() => {
		familyMembersList = familyStore?.getFamilyMembersDetails() || [];
		isFamilyPortfolio = appStore?.isFamilyPortfolioSelected(selfClientCode);
		isLoaded = true;
	}, 150);

	const redirectToFamilyPage = () => {
		goto(`${base}/investments/family`);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if isLoaded && familyMembersList?.length > 1}
	<section
		class="flex items-center rounded-2xl bg-white px-2 py-1 text-sm font-normal text-black-key md:cursor-pointer {$$props?.class ||
			''}"
		on:click={redirectToFamilyPage}
	>
		<WMSIcon name={isFamilyPortfolio ? 'family' : 'profile'} />
		<div class="ml-0.5">{isFamilyPortfolio ? 'Family' : 'You'}</div>
		<DownArrowLargeIcon class="ml-1 w-fit px-1" />
	</section>
{/if}
