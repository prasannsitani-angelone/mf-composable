<script lang="ts">
	import RatingChip from './RatingChip.svelte';
	let rating: number;
	let name: string;
	export { rating, name };
</script>

<div class={`flex flex-grow basis-0 `}>
	<div class="text-sm font-medium text-title">{name}</div>
	<div class="ml-auto"><RatingChip {rating} /></div>
</div>
