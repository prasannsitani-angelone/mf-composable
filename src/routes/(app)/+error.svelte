<script lang="ts">
	import SomethingWentWrong from '$components/Error/SomethingWentWrong.svelte';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import BottomNavigation from '$components/BottomNavigation.svelte';
	import { BOTTOM_NAVBARS } from '$lib/constants/navItems';

	let version = '';
</script>

<article class="-mx-2 h-[calc(100vh-80px)] bg-white">
	<section class="md:hidden">
		<MobileHeader
			title={'Mutual Funds'}
			showSearchIcon={true}
			showBackIcon={false}
			showCloseIcon={true}
			class="fixed left-0 right-0 top-0 z-100 bg-white"
		/>
	</section>
	<section class="flex h-full flex-col items-center justify-center pb-12 md:pb-0">
		<SomethingWentWrong showPageLayout={true} />
	</section>
</article>

<section class="fixed -mx-2 -mt-12 w-full md:hidden">
	<BottomNavigation navs={BOTTOM_NAVBARS(version)} />
</section>
