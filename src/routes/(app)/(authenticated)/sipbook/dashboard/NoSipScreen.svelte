<script lang="ts">
	import NoSipImage from '$lib/images/icons/NoSipImage.svelte';
	import { page } from '$app/stores';

	$: isMobile = $page?.data?.deviceType?.isMobile;
</script>

<section
	class="cardHeight flex flex-col items-center justify-center bg-background-alt shadow-csm {isMobile
		? '-mx-2 mt-2 px-8 py-5'
		: 'rounded-lg px-6 py-[52px]'}"
>
	<NoSipImage />
	<div class="mt-2 text-center text-lg font-medium text-title">You do not have any active SIP</div>

	<div class="mt-2 text-center text-sm font-normal text-body">
		Invest with SIPs to generate long term returns
	</div>
</section>
