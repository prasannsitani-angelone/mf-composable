<script lang="ts">
	import RightArrowDarkIcon from '$lib/images/icons/RightArrowDarkIcon.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';

	export let name = '';
	export let subtext = '';
	export let logoUrl = '';
</script>

<section class={$$props.class}>
	<article class="flex items-center">
		<slot name="leftSection">
			<section class="flex items-center justify-between">
				<SchemeLogo size="xs" src={logoUrl} alt="logo" />
				<article class="ml-2 flex flex-col items-start">
					<div class="w-52 text-sm font-normal">
						{name}
					</div>
					<slot name="subtextSlot">
						<div class="mt-1 text-xs font-normal text-body">
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
