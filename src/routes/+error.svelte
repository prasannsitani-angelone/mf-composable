<script lang="ts">
	import SomethingWentWrong from '$components/Error/SomethingWentWrong.svelte';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import { appStore } from '$lib/stores/SparkStore';
</script>

<article class="h-full">
	<MobileHeader
		title={'Mutual Funds'}
		showSearchIcon={true}
		showBackIcon={$appStore.isSparkAndroidUser || $appStore.isSparkIOSUser}
		closeAppOnBackPress={true}
		class="fixed left-0 right-0 top-0 bg-background-alt"
	/>
	<section class="flex h-full flex-col items-center justify-center">
		<SomethingWentWrong showPageLayout={true} />
	</section>
</article>
