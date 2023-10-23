<script>
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import ActiveAutopay from '$components/SipHealth/Cards/Details/ActiveAutopay.svelte';

	let autoPayClick = () => {
		const redirectPath = `${base}/autopay/manage`;
		goto(redirectPath);
	};
</script>

<ActiveAutopay>
	<ButtonMedium slot="footer" onClick={autoPayClick} class="mb-10 w-[90%] self-center">
		SET UP AUTOPAY
	</ButtonMedium>
</ActiveAutopay>
