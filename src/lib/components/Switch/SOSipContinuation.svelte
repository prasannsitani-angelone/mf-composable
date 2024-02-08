<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	let switchOutFundName = '';
	export { switchOutFundName };
</script>

<section class="flex items-center justify-center rounded-sm bg-background p-4 text-xs text-body">
	<div>
		<WMSIcon name="rupee-square-blue" />
	</div>
	<div class="mx-2">
		Your <b class="text-title">active SIPs for switch out fund</b> ({switchOutFundName}) are not
		affected. They will continue as usual.
	</div>
</section>
