<script lang="ts">
	import WmsIcon from '$components/WMSIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount.js';
	import type { INudge } from '$lib/types/INudge';
	import { getSipAmountWithoutMandate } from '../../utils';

	export let nudgeData: INudge[];
	let amount: number;
	$: amount = getSipAmountWithoutMandate(nudgeData);
</script>

<section
	class="mx-5 flex justify-center rounded-full bg-red-light px-3 py-2 text-red-errorDark {$$props.class ||
		''}"
>
	<div class=" text-base font-semibold">
		Your SIPs worth ₹{addCommasToAmountString(amount)} are at risk
	</div>
	<WmsIcon class="ml-2.5" name="loss-double-stacked" />
</section>
