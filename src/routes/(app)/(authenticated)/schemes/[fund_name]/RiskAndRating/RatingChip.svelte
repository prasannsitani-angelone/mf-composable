<script lang="ts">
	import StarIcon from '$lib/images/icons/StarIcon.svelte';

	let rating: number;
	let containerClass =
		rating > 0 ? 'border-yellow-primary bg-yellow-background' : 'border-grey-line bg-grey';
	export { rating };
</script>

<div class={`flex h-5 w-6 items-center rounded-sm border px-1 ${containerClass} ${$$props.class}`}>
	{#if rating}
		<div class="text-[9px] font-medium">{rating}</div>
	{:else}
		<div class="text-[9px] font-medium text-grey-disabled">N/A</div>
	{/if}

	<StarIcon class="ml-[2px] h-2 w-2" />
</div>
