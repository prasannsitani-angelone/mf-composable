<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import FamilyMember from '$components/FamilyPortfolio/FamilyMember.svelte';
	import type { FamilyMemberTypes } from '$lib/types/IFamilyPortfolio';
	import { Checkbox } from 'svelte-components';
	import { familyStore } from '$lib/stores/FamilyStore';
	import { appStore } from '$lib/stores/SparkStore';
	import FamilyPageFooter from '$components/FamilyPortfolio/FamilyPageFooter.svelte';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import FamilyPortfolioInfo from '$components/FamilyPortfolio/FamilyPortfolioInfo.svelte';

	let familyList: FamilyMemberTypes[] = $familyStore;
	let familyListReactive: FamilyMemberTypes[];
	$: familyListReactive = familyList;

	let selectAllMembers = false;

	const areAllMembersSelected = () => {
		let allMembersSelected = true;
		familyList?.forEach((member) => {
			if (!member?.selected) {
				allMembersSelected = false;
			}
		});

		return allMembersSelected;
	};

	const isAnyMemberUnselected = () => {
		let anyMemberUnselected = false;
		familyList?.forEach((member) => {
			if (!member?.selected) {
				anyMemberUnselected = true;
			}
		});

		return anyMemberUnselected;
	};

	const handleSelectAllMembers = () => {
		if (areAllMembersSelected()) {
			selectAllMembers = true;
		} else if (isAnyMemberUnselected()) {
			selectAllMembers = false;
		}
	};

	const redirectToPortfolio = async () => {
		if (familyList?.length <= 1) {
			await goto(`${base}/investments`);
		}
	};

	onMount(() => {
		redirectToPortfolio();
		handleSelectAllMembers();
	});

	const handleOptionClick = (e: Event, familyMember: FamilyMemberTypes, index: number) => {
		e?.stopPropagation();
		e.preventDefault();

		const member: FamilyMemberTypes = familyMember;
		member.selected = !member.selected;

		familyList[index] = member;

		handleSelectAllMembers();
		familyListReactive = familyList;
	};

	const setSelectAllMembers = () => {
		if (selectAllMembers) {
			(familyList || [])?.forEach((member) => {
				member.selected = false;
			});

			selectAllMembers = false;
		} else {
			(familyList || [])?.forEach((member) => {
				member.selected = true;
			});

			selectAllMembers = true;
		}
		familyListReactive = familyList;
	};

	const getSelectedMembers = () => {
		let selectedMembersClientCodes: string[] = [];

		familyList?.forEach((member) => {
			if (member?.selected) {
				selectedMembersClientCodes?.push(member?.party_code);
			}
		});

		return selectedMembersClientCodes;
	};

	const handleViewHoldingsClick = async () => {
		familyStore?.set(familyList);
		appStore?.updateStore({ linkedMembers: { selected: getSelectedMembers() } });

		await goto(`${base}/investments`);
	};

	const handleBackNavigation = async () => {
		if (window.history.length === 1) {
			await goto(`${base}/investments`);
		} else {
			history.back();
		}
	};
</script>

<article class={`hidden rounded-t-lg px-5 py-4 text-center md:flex ${$$props?.class}`}>
	<article class="flex w-full cursor-pointer items-center justify-start">
		<LeftArrowIcon class="mr-4 cursor-pointer" onClick={handleBackNavigation} />
		<h1 class="cursor-default text-base font-normal text-black-key">
			<div class="truncate text-left">Family Portfolio</div>
		</h1>
		<section class="ml-1">
			<FamilyPortfolioInfo />
		</section>
	</article>
</article>

<section class="mx-2 md:rounded-xl md:bg-white md:shadow-csm">
	{#if familyListReactive?.length}
		<section class="md:p-6">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<article
				class="flex items-center justify-between border-b px-3 py-2 md:cursor-pointer"
				on:click={setSelectAllMembers}
			>
				<div class="text-sm font-normal text-black-key">Select All</div>

				<Checkbox class="ml-[-4px]" checked={selectAllMembers} label="" />
			</article>
			<article>
				{#each familyListReactive as familyMember, index (familyMember?.party_code)}
					{#if familyMember?.status?.toLowerCase() === 'accepted'}
						<section class="mt-3">
							<FamilyMember
								{familyMember}
								on:memberClick={(e) => handleOptionClick(e, familyMember, index)}
								clientName={$page.data?.profile?.clientDetails?.fullName}
							/>
						</section>
					{/if}
				{/each}
			</article>
		</section>

		<FamilyPageFooter on:viewHoldingsClick={handleViewHoldingsClick} />
	{/if}
</section>
