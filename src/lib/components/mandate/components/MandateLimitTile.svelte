<script lang="ts">
	import { WMSIcon } from 'wms-ui-component';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	export let mandateLimit: string;
	export let heading = 'Mandate Limit:';
</script>

<div class="w-full p-0 {$$props.class}">
	<div class="hidden flex-row justify-center rounded bg-grey py-3 sm:flex">
		<span class="mr-2 text-grey-body">{heading}</span>
		<span class="text-black-title">₹{addCommasToAmountString(mandateLimit)}</span>
	</div>
	<div
		class="text-title-black flex flex-row items-center justify-center rounded border border-grey-line bg-white py-1 text-lg font-medium sm:hidden"
	>
		<WMSIcon name="jar" height={60} width={60} />
		<div class="ml-3">
			<div class="text-xs text-grey-body">
				{heading}
			</div>
			<div class="text-lg font-medium text-black-title">
				₹{addCommasToAmountString(mandateLimit)}
			</div>
		</div>
	</div>
</div>
