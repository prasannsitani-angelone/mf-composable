<script lang="ts">
	import { WMSIcon } from 'wms-ui-component';

	let switchOutFundName = '';
	export { switchOutFundName };
</script>

<section class="flex items-center justify-center rounded-sm bg-grey p-4 text-xs text-grey-body">
	<div>
		<WMSIcon name="rupee-square-blue" />
	</div>
	<div class="mx-2">
		Your <b class="text-black-title">active SIPs for switch out fund</b> ({switchOutFundName}) are
		not affected. They will continue as usual.
	</div>
</section>
