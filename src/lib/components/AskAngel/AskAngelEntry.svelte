<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { WMSIcon } from 'svelte-components';
	import AskAngel from './AskAngel.svelte';
	import Button from '../Button.svelte';
	import { base } from '$app/paths';

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

<section>
	{#if !showAskAngel}
		<article class="absolute inset-0 bottom-20 left-auto right-2 top-auto lg:bottom-11 lg:right-11">
			<Button class="w-full rounded-full" onClick={handleAskAngelEntryPointClick}>
				<WMSIcon name="happy-face-emoji" />
				<span class="ml-1 font-normal">Ask Angel</span>
			</Button>
		</article>
	{:else}
		<article class="absolute inset-0 left-auto top-auto">
			<AskAngel on:closeAskAngel={onCloseAskAngel} />
		</article>
	{/if}
</section>
