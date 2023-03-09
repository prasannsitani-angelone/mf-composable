<script lang="ts">
	import StarIcon from '$lib/images/icons/StarIcon.svelte';

	let arqRating: number;

	export { arqRating };
</script>

<div
	class=" py-1/2 flex w-min items-center justify-end rounded-sm border border-white bg-gray-100 px-1 group-hover:border group-hover:border-gray-200 group-hover:bg-white"
>
	<span class="mr-1 text-grey-body">
		{arqRating}
	</span>
	<StarIcon class="h-4 w-4" />
</div>
