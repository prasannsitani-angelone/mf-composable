<script>
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import ActiveAutopay from '$components/SipHealth/Cards/Details/ActiveAutopay.svelte';
	import { sipHealthDetailsPageSetupAutopayCtaClickAnalytics } from '$lib/analytics/siphealth/siphealth';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { profileStore } from '$lib/stores/ProfileStore';

	$: bankDetails = $profileStore?.bankDetails;

	let autoPayClick = () => {
		sipHealthDetailsPageSetupAutopayCtaClickAnalytics({ Page: 'SipHealthMsgCard' });

		const params = encodeObject({
			acc: bankDetails?.[0]?.accNO
		});
		goto(`${base}/autopay/manage/setup?params=${params}`);
	};
</script>

<ActiveAutopay class={$$props.class}>
	<ButtonMedium slot="footer" onClick={autoPayClick} class="mb-10 w-[90%] self-center">
		SET UP AUTOPAY
	</ButtonMedium>
</ActiveAutopay>
