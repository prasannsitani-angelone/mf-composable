<script>
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import ActiveAutopay from '$components/SipHealth/Cards/Details/ActiveAutopay.svelte';
	import { sipHealthDetailsPageSetupAutopayCtaClickAnalytics } from '$lib/analytics/siphealth/siphealth';

	let autoPayClick = () => {
		sipHealthDetailsPageSetupAutopayCtaClickAnalytics({ Page: 'SipHealthMsgCard' });

		const redirectPath = `${base}/autopay/manage`;
		goto(redirectPath);
	};
</script>

<ActiveAutopay class={$$props.class}>
	<ButtonMedium slot="footer" onClick={autoPayClick} class="mb-10 w-[90%] self-center">
		SET UP AUTOPAY
	</ButtonMedium>
</ActiveAutopay>
