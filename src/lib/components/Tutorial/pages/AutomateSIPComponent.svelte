<script lang="ts">
	import WMSIcon from '$components/WMSIcon.svelte';
	import Icon4 from '$components/Tutorial/icons/AutomateSipBgIcon.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { HEIGHT_OFFSET } from '$components/Tutorial/pages/const';

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
	let clientHeight = 0;
</script>

<div
	bind:clientHeight
	on:touchstart={setStartTouchPoints}
	on:touchend={setEndTouchPoints}
	class="flex h-screen flex-col bg-[#FACE80] p-5 {$$props.class}"
>
	<section class="flex-1">
		<p class="mb-3 mt-10 text-2xl font-medium text-black-key">Automating SIP Payments</p>
		{#if clientHeight > HEIGHT_OFFSET}
			<Icon4 class="mx-auto mb-3" />
		{/if}

		<ul class="ml-3">
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
