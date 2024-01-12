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

<div class="my-2 flex items-center rounded-lg bg-white px-4 py-3 shadow-sm {$$props.class}">
	<div>
		<img
			height="80"
			width="95"
			src={AskAngelIcon}
			loading="lazy"
			alt="Illustration showing ask angel"
		/>
	</div>
	<div class="flex flex-col pl-4">
		<p class="font-medium text-black-key">Not sure where to invest your money?</p>
		<p class="py-2 text-xs text-black-bolder">
			Let us match you with the right investments based on your goals
		</p>
		<Button
			class="!w-32 !whitespace-nowrap"
			size="sm"
			onClick={() => handleAskAngelEntryPointClick()}>ASK ANGEL</Button
		>
	</div>
	{#if showAskAngel}
		<article class="fixed inset-0 left-auto top-auto">
			<AskAngel on:closeAskAngel={onCloseAskAngel} />
		</article>
	{/if}
</div>
