<script lang="ts">
	import TextInput from '$components/TextInput.svelte';
	import SearchDarkIcon from '$lib/images/icons/SearchDarkIcon.svelte';

	let classes = {
		container: 'py-3 mr-1 w-full border-none rounded-md',
		label: '',
		input:
			'w-full !border-none focus:outline-none placeholder-body md:placeholder-disabled !text-base !text-title font-normal lg:font-normal !input-xs !pl-0',
		error: '',
		parent: 'w-full'
	};
</script>

<article class="mt-2 rounded-3xl bg-white">
	<section class={`relative flex flex-col items-center justify-center md:px-3`}>
		<!-- Search Input -->
		<div class="flex w-full cursor-text items-center rounded-md border-0 lg:w-[440px]">
			<article class="flex w-full items-center">
				<SearchDarkIcon class="mx-4 h-6 w-6 text-title" />
				<TextInput
					id="searchInput"
					name="searchInput"
					placeholder="Search by fund name, type or AMC"
					{classes}
				/>
			</article>
		</div>
	</section>
</article>
