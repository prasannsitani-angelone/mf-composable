<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	interface List {
		title: string;
		action: () => '';
		icon: string;
		class?: string;
		iconWidth?: string;
		iconHeight?: string;
		iconDivClass?: string;
	}
	export let list: List[] = [];
	export let listClass = '';
	export let iconHeight = 36;
	export let iconWidth = 36;
</script>

<div class="flex w-72 flex-col gap-1 rounded-lg bg-background-alt {$$props.class}">
	{#each list as item, index (index)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="flex flex-row items-center px-4 py-3 active:opacity-50 {index !== list.length - 1
				? 'border-b'
				: ''} {listClass} {item.class || ''}"
			on:click={item.action}
		>
			<div class="mr-4 {item?.iconDivClass}">
				<WMSIcon
					name={item.icon}
					height={item?.iconHeight || iconHeight}
					width={item?.iconWidth || iconWidth}
				/>
			</div>
			<div class="text-base font-normal text-title">
				{item.title}
			</div>
		</div>
	{/each}
</div>
