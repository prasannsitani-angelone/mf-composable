<script lang="ts">
	import StarIcon from '$lib/images/icons/StarIcon.svelte';

	let rating: number;
	let containerClass =
		rating > 0 ? 'border-secondary bg-tint12-secondary' : 'border-border bg-background';
	export { rating };
</script>

<div
	class={`flex h-5 w-9 items-center justify-center rounded-sm border px-1 ${containerClass} ${$$props.class}`}
>
	{#if rating}
		<div class="text-xs font-medium text-title">{rating}</div>
		<StarIcon class="ml-[2px] h-2 w-2" />
	{:else}
		<div class="text-[9px] font-medium text-disabled">NA</div>
	{/if}
</div>
