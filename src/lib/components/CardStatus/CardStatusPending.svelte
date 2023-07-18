<script lang="ts">
	import WmsIcon from "$components/WMSIcon.svelte";

	export let heading = '';
	export let subHeading = '';
	export let headerClass = '';
	export let subHeaderClass = '';
</script>

<article
	class="flex flex-col px-5 py-2 bg-yellow-background {$$props?.class}"
>
	{#if heading}
		<div class="flex flex-row items-center font-medium text-black-title {headerClass}">
			<slot name="statusIcon">
				<WmsIcon name="time-pending" />
			</slot>
			<div class="ml-2 text-sm md:text-base">
				{heading}
			</div>
		</div>
	{/if}
	{#if subHeading}
		<div class="mt-1.5 flex w-full flex-col text-sm {subHeaderClass}">
			<div class="text-sm">
				{subHeading}
			</div>
		</div>
	{/if}
</article>
