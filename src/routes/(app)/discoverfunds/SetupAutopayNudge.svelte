<script>
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import { modifiedGoto } from '$lib/utils/goto';
	import SetupAutopayBg from '$components/SetupAutopayBg.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { encodeObject } from '$lib/utils/helpers/params';

	$: bankDetails = $profileStore?.bankDetails;

	const goToSetupAutopay = () => {
		const params = encodeObject({
			acc: bankDetails?.[0]?.accNO
		});
		modifiedGoto(`${base}/autopay/manage/setup?params=${params}`);
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="light relative flex items-center rounded-lg hover:cursor-pointer {$$props.class}"
	on:click={goToSetupAutopay}
>
	<div class="z-2 absolute h-full w-full"><SetupAutopayBg class="absolute h-full w-full" /></div>
	<div class="z-0 flex items-center p-4">
		<div class="flex flex-col">
			<p class="text-sm font-medium text-black-key">Set Up Autopay for SIPs</p>
			<p class="py-1 pr-28 text-xs text-black-key">
				Automate all your SIP payments in 2 simple steps
			</p>
			<Button size="xs" class="mr-4 mt-1 w-fit px-2 text-xs">SET UP AUTOPAY</Button>
		</div>
	</div>
</div>
