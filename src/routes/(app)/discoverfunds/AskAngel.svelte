<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import AskAngelIcon from '$lib/images/AskAngelIcon.svg';
	import AskAngel from '$components/AskAngel/AskAngel.svelte';
	import { page } from '$app/stores';

	let showAskAngel = false;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	const handleAskAngelEntryPointClick = () => {
		if (isMobile || isTablet) {
			goto(`${base}/askangel`);
		} else {
			showAskAngel = true;
		}
	};

	const onCloseAskAngel = () => {
		showAskAngel = false;
	};
</script>

<div class="my-2 flex flex-col items-start rounded-lg bg-white px-4 py-3 shadow-sm {$$props.class}">
	<p class="text-left font-medium text-black-key">Not sure where to invest your money?</p>
	<div class="flex items-center">
		<div class="flex flex-col">
			<p class="py-2 pr-2 text-xs text-black-bolder">
				Let us match you with the right investments based on your goals
			</p>
			<Button
				class="!w-32 !whitespace-nowrap"
				size="sm"
				onClick={() => handleAskAngelEntryPointClick()}>ASK ANGEL</Button
			>
		</div>
		<div>
			<img src={AskAngelIcon} loading="lazy" alt="Illustration showing ask angel" />
		</div>
	</div>
	{#if showAskAngel}
		<article class="fixed inset-0 left-auto top-auto">
			<AskAngel on:closeAskAngel={onCloseAskAngel} />
		</article>
	{/if}
</div>
