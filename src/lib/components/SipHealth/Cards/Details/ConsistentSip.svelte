<script>
	import SipHealthCalendarIcon from '$components/SipHealth/Images/SipHealthCalendarIcon.svelte';

	let title = 'Consistent SIP Payments';
	let description =
		'Pay your monthly SIP instalments with zero misses. Being punctual and consistent with SIP payments improves your SIP health score';
</script>

<div
	class="flex h-[450px] w-fit flex-col items-start justify-self-center rounded-lg bg-white {$$props.class}"
>
	<p class="mt-6 px-6 text-4xl font-medium text-[#581DBE]">02</p>
	<p class="mb-4 px-6 text-2xl font-medium text-black-title">{title}</p>
	<p class="px-6 text-sm text-black-title">{description}</p>

	<div class="flex h-full w-full items-center justify-center">
		<SipHealthCalendarIcon />
	</div>
</div>
