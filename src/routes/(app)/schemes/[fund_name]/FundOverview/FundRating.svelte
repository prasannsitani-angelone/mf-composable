<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	export let rating = 5;
	export let ratingSecId = '';
</script>

<div class=" relative {$$props.class || ''}">
	<div><WMSIcon name="arc-leaves" height={36} width={36} /></div>
	<div
		id="schemeRatingInfo-{ratingSecId || ''}"
		class=" absolute left-[0.6rem] top-2 flex items-center"
	>
		<span class=" text-sm font-semibold text-black-title">{rating}</span>
		<div class="rating gap-1">
			<input type="radio" name="rating-3" class="mask mask-star h-3 w-3 bg-yellow-secondary" />
		</div>
	</div>
</div>
