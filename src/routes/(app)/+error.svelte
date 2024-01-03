<script lang="ts">
	import SomethingWentWrong from '$components/Error/SomethingWentWrong.svelte';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
</script>

<article class="h-full">
	<MobileHeader
		title={'Mutual Funds'}
		showSearchIcon={true}
		showBackIcon={false}
		showCloseIcon={true}
		class="fixed left-0 right-0 top-0 bg-white"
	/>
	<section class="flex h-full flex-col items-center justify-center">
		<SomethingWentWrong showPageLayout={true} />
	</section>
</article>
