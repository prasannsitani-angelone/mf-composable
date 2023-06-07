<script lang="ts">
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';
	import { WMSIcon } from 'wms-ui-component';

	export let onBackClick: () => void = () => undefined;
</script>

<div
	class="sm:border-line-grey z-10 flex flex-row items-center justify-between p-4 shadow-csm sm:border-b sm:px-8 sm:py-6 sm:shadow-none"
>
	<div class="flex flex-row items-center">
		<WMSIcon
			class="mr-3 sm:hidden"
			name="left-arrow"
			width={16}
			height={16}
			on:click={onBackClick}
		/>
		<div class="text-lg font-medium text-black-title sm:text-xl">Select Payment Method</div>
	</div>
	<div class="hidden sm:flex">
		<CrossInCircleIcon onClick={onBackClick} />
	</div>
</div>
