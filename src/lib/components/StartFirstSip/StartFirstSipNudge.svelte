<script lang="ts">
	// import type { StartFirstSipNudgeType } from '$lib/types/INudge';
	import Button from '$components/Button.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import StartFirstSipImage from '$lib/images/StartFirstSipImage.svelte';

	// export let nudgeData: StartFirstSipNudgeType;

	const redirectToStartFirstSipLandingPage = () => {
		goto(`${base}/startfirstsip`);
	};
</script>

<article class="mb-2 rounded-lg bg-white py-3 px-4 text-black-title shadow-csm">
	<div class="text-lg font-medium">Start your Investment Journey</div>
	<div class="font-sm mt-2">Step-by-Step guide to make your first investment</div>
	<div class="mt-3 flex justify-center">
		<StartFirstSipImage />
	</div>

	<Button class="w-full" onClick={redirectToStartFirstSipLandingPage}>GET STARTED</Button>
</article>
