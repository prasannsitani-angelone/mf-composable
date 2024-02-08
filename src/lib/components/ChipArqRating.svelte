<script lang="ts">
	import StarIcon from '$lib/images/icons/StarIcon.svelte';

	let arqRating: number;
	let clazz = '';
	let headingClass = '';
	export { arqRating, clazz as class, headingClass };
</script>

<div
	class={`py-1/2 flex w-min items-center justify-end rounded border border-background-alt bg-gray-100 px-1 group-hover:border group-hover:border-gray-200 group-hover:bg-background-alt ${clazz}`}
>
	<span class={`mr-1 text-body ${headingClass}`}>
		{arqRating}
	</span>
	<StarIcon class="h-4 w-4" />
</div>
