<script lang="ts">
	import RightArrowDarkIcon from '$lib/images/icons/RightArrowDarkIcon.svelte';

	export let name = '';
	export let subtext = '';
	export let logoUrl = '';
</script>

<section class={$$props.class}>
	<article class="flex items-center">
		<slot name="leftSection">
			<section class="flex items-center justify-between">
				<div class="flex-1 rounded-full border border-grey">
					<img src={logoUrl} alt="logo" class="h-9 w-9" />
				</div>

				<article class="ml-2 flex flex-col items-start">
					<div class="w-52 text-sm font-normal">
						{name}
					</div>
					<slot name="subtextSlot">
						<div class="mt-1 text-xs font-normal text-grey-body">
							{subtext}
						</div>
					</slot>
				</article>
			</section>
		</slot>

		<slot name="rightSection">
			<RightArrowDarkIcon class="ml-auto mr-3" />
		</slot>
	</article>
</section>
