<script>
	import { page } from '$app/stores';
	import WhatIsSipHealthDesktopIcon from '$components/SipHealth/Images/WhatIsSipHealthDesktopIcon.svelte';
	import WhatIsSipHealthMobileIcon from '$components/SipHealth/Images/WhatIsSipHealthMobileIcon.svelte';

	$: isMobile = $page?.data?.deviceType?.isMobile;
</script>

<div
	class="flex h-[450px] w-fit flex-col items-start justify-self-center rounded-lg bg-white {$$props.class}"
>
	<p class="mt-6 px-6 text-4xl font-medium text-[#581DBE]">01</p>
	<p class="mb-4 px-6 text-2xl font-medium text-black-title">What is SIP Health?</p>
	<p class="mb-10 px-6 text-sm text-black-title">
		Your SIP health score is reflection of your investing habits. It is calculated using multiple
		factors like your investing discipline, consistency, and overall portfolio growth.
	</p>

	<div class="flex h-full flex-col-reverse self-stretch">
		{#if isMobile}
			<WhatIsSipHealthMobileIcon class="w-full rounded-b-lg" />
		{:else}
			<WhatIsSipHealthDesktopIcon class="w-full rounded-b-lg" />
		{/if}
	</div>
</div>
