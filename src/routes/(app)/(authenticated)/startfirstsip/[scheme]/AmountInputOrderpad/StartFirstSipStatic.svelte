<script lang="ts">
	import StartFirstSipImage from '$lib/images/StartFirstSipImage.svelte';
	import DotIcon from '$lib/images/icons/DotIcon.svelte';

	const textPoints = ['Higher returns than FDs', 'Monthly investment plan', 'Withdraw anytime'];
</script>

<article>
	<div class="text-xl font-semibold text-black-key">Start investing in Mutual Funds!</div>

	<div class="mt-2">
		{#each textPoints as point (point)}
			<div class="flex items-center">
				<DotIcon />
				<span class="ml-3">{point}</span>
			</div>
		{/each}
	</div>

	<div class="mb-20 mt-6 flex items-center justify-center">
		<StartFirstSipImage width="316" height="223" />
	</div>
</article>
