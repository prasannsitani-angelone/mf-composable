<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount.js';

	export let totalAmount: number;
</script>

<section
	class="mx-5 flex justify-center rounded-full bg-tint12-sell px-3 py-2 text-sell {$$props.class ||
		''}"
>
	<div class=" text-base font-medium">
		Your SIPs worth ₹{addCommasToAmountString(totalAmount)} are at risk
	</div>
	<WMSIcon class="ml-2.5" name="risk-plug" />
</section>
