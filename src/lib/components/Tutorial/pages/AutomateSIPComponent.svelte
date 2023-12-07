<script lang="ts">
	import WMSIcon from '$components/WMSIcon.svelte';
	import Icon4 from '$components/Tutorial/icons/Icon4.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let options = [
		'Autopay helps you automate your SIP payments',
		'SIP amount is debited automatically from your bank account on the monthly SIP date',
		'Autopay also works for all your future SIPs. Never miss an SIP payment!',
		'Set up autopay with UPI in just a few steps'
	];

	let touchStartX = 0;
	let touchEndX = 0;
	let touchStartY = 0;
	let touchEndY = 0;

	const setStartTouchPoints = (e) => {
		touchStartX = e?.changedTouches[0]?.screenX;
		touchStartY = e?.changedTouches[0]?.screenY;
	};

	const setEndTouchPoints = (e) => {
		touchEndX = e?.changedTouches[0]?.screenX;
		touchEndY = e?.changedTouches[0]?.screenY;
		determineGesture();
	};

	const determineGesture = () => {
		let swipeThresholdValue = 100;
		if (touchStartY - touchEndY > 0 && touchStartY - touchEndY > swipeThresholdValue) {
			navigateToAutoPay();
		}
	};

	const navigateToAutoPay = async () => {
		const path = `${base}/autopay/manage`;
		console.log(path);
		await goto(path);
	};

	$: height = browser ? window?.innerHeight : 0;
</script>

<div
	style="height: {height}px"
	on:touchstart={setStartTouchPoints}
	on:touchend={setEndTouchPoints}
	class="flex flex-col bg-[#FACE80] px-8 py-5 {$$props.class}"
>
	<section class="flex-1">
		<p class="mb-10 mt-10 text-2xl font-medium text-black-key">Automating SIP Payments</p>
		<Icon4 class="mx-auto mb-10" />

		<ul class="mb-10 ml-3">
			{#each options as option}
				<li class="mb-2 list-disc text-sm font-normal leading-6 text-black-key">
					{option}
				</li>
			{/each}
		</ul>
	</section>

	<section class="flex flex-col items-center justify-center">
		<WMSIcon width={14} height={8} name="swipe-up" stroke="black" class="mb-1" />
		<p class="text-sm font-medium text-black-key">Swipe up to explore UPI Autopay</p>
	</section>
</div>
