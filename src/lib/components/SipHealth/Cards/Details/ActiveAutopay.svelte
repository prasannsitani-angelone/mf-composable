<script>
	import SipHealthAutoPayIcon from '$components/SipHealth/Images/SipHealthAutoPayIcon.svelte';

	let title = 'Active Autopay';
	let description =
		'Autopay helps you automate your SIP payments and build investing discipline. Autopay also works for all your future SIPs, so setting it up impacts your score positively';
</script>

<div
	class="flex h-[450px] w-fit flex-col items-start justify-self-center rounded-lg bg-white {$$props.class}"
>
	<p class="mt-6 px-6 text-4xl font-medium text-[#F9BA4D]">01</p>
	<p class="mb-4 px-6 text-2xl font-medium text-black-title">{title}</p>
	<p class="px-6 text-sm text-black-title">{description}</p>

	<div class="flex h-full w-full items-center justify-center">
		<SipHealthAutoPayIcon />
	</div>

	<slot name="footer" />
</div>
