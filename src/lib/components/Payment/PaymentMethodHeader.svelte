<script lang="ts">
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	export let onBackClick: () => void = () => undefined;
	export let title = 'Complete Your Payment';
	export let isPartOfModal = false;
</script>

<div
	class="z-10 flex flex-row items-center justify-between bg-background-alt p-4 shadow-csm {isPartOfModal
		? 'sm:border-b sm:px-8 sm:py-6 sm:shadow-none'
		: ''}"
>
	<div class="flex flex-row items-center">
		{#if isPartOfModal}
			<WMSIcon
				class="mr-3 sm:hidden"
				name="left-arrow"
				stroke="var(--TITLE)"
				width={16}
				height={16}
				on:click={onBackClick}
			/>
		{:else}
			<WMSIcon class="mr-3" name="left-arrow" width={16} height={16} on:click={onBackClick} />
		{/if}
		<div class="text-lg font-normal text-title sm:text-xl">{title}</div>
	</div>
	{#if isPartOfModal}
		<div class="hidden sm:flex">
			<CrossInCircleIcon onClick={onBackClick} />
		</div>
	{/if}
</div>
