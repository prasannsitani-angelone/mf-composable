<script lang="ts">
	import { base } from '$app/paths';
	import AskAngelBg from '$components/AskAngelBg.svelte';
	import AskAngel from '$components/AskAngel/AskAngel.svelte';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import { modifiedGoto } from '$lib/utils/goto';

	let showAskAngel = false;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	const handleAskAngelEntryPointClick = () => {
		if (isMobile || isTablet) {
			modifiedGoto(`${base}/askangel`);
		} else {
			showAskAngel = true;
		}
	};

	const onCloseAskAngel = () => {
		showAskAngel = false;
	};
</script>

<div class="relative flex items-center rounded-lg {$$props.class}">
	<div class="z-2 absolute h-full w-full"><AskAngelBg class="absolute h-full w-full" /></div>
	<div class="z-0 flex items-center p-4">
		<div class="flex flex-col">
			<p class="text-sm font-medium text-black-key">Not sure where to invest your money?</p>
			<p class="py-1 pr-28 text-xs text-black-key">
				Let us match you with the right investments based on your goals
			</p>
			<Button
				class="mt-1 !w-32 !whitespace-nowrap !text-xs"
				size="sm"
				onClick={handleAskAngelEntryPointClick}>ASK ANGEL</Button
			>
		</div>
	</div>
</div>
{#if showAskAngel}
	<article class="fixed inset-0 left-auto top-auto z-0">
		<AskAngel on:closeAskAngel={onCloseAskAngel} />
	</article>
{/if}
