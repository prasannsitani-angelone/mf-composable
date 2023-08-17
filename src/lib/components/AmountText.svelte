<script lang="ts">
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	let amount: string | number;

	export { amount };
</script>

<span class={$$props.class}>
	₹{addCommasToAmountString(amount)}
</span>
