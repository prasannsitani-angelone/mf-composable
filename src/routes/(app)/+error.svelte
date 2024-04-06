<script lang="ts">
	import SomethingWentWrong from '$components/Error/SomethingWentWrong.svelte';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import { appStore } from '$lib/stores/SparkStore';

	const reloadPageOnRetry = () => {
		if (navigator?.onLine) {
			window?.location?.reload();
		}
	};
</script>

<article class="-mx-2 h-[calc(100vh-80px)] bg-background-alt">
	<section class="md:hidden">
		<MobileHeader
			title={'Mutual Funds'}
			showSearchIcon={true}
			showBackIcon={$appStore.isSparkAndroidUser || $appStore.isSparkIOSUser}
			closeAppOnBackPress={true}
			class="fixed left-0 right-0 top-0 z-100 bg-background-alt"
		/>
	</section>
	<section class="flex h-full flex-col items-center justify-center pb-12 md:pb-0">
		<SomethingWentWrong showPageLayout={true} on:retryButtonClick={reloadPageOnRetry} />
	</section>
</article>
