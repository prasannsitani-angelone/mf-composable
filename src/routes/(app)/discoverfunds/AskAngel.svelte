<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import AskAngel from '$components/AskAngel/AskAngel.svelte';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';

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

<div class="bg-image mt-2 flex items-center rounded-lg {$$props.class}">
	<div class="flex items-center p-4">
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
	<article class="fixed inset-0 left-auto top-auto">
		<AskAngel on:closeAskAngel={onCloseAskAngel} />
	</article>
{/if}

<style>
	.bg-image {
		background-image: url('$lib/images/AskAngelIcon.svg');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
</style>
