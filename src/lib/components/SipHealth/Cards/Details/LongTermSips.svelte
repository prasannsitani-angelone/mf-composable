<script>
	import YearTimelineIcon from '$components/SipHealth/Images/YearTimelineIcon.svelte';

	let title = 'Long Term, Active SIPs';
	let description =
		'SIPs help you build wealth in the long term. Staying invested longer with consistent payments gives you a better chance to build wealth and a higher SIP score';
</script>

<div
	class="flex h-[450px] w-fit flex-col items-start justify-self-center rounded-lg bg-background-alt {$$props.class}"
>
	<p class="mt-6 px-6 text-4xl font-medium text-[#008F75]">03</p>
	<p class="mb-4 px-6 text-2xl font-medium text-title">{title}</p>
	<p class="px-6 text-sm text-title">{description}</p>

	<div class="mb-20 flex h-full w-full items-center justify-center">
		<YearTimelineIcon />
	</div>
</div>
